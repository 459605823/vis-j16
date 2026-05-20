/**
 * PLC WebServer 认证 & 保活模块
 *
 * 通信端点：POST /api/jsonrpc  (经 Vite 代理转发至 VITE_API_HOST)
 * 协议：JSON-RPC 2.0
 *
 * 流程：
 *   initPlcAuth() → plcLogin() → 获取 Token → startKeepalive()
 *                                              ↓（每 60s）
 *                                          Api.Ping（携带 Token）
 *                                              ↓ 失败时
 *                                          重新 plcLogin()
 */

import api from './fetch';
import {tokenStore} from './token';

// PLC JSON-RPC 端点（相对于 baseUrl "/api"，实际请求路径为 /api/jsonrpc）
const RPC_ENDPOINT = '/jsonrpc';

// 固定数据块名
const DB_NAME = '"WebData"';

// 保活间隔：60 秒（PLC Session 超时为 120 秒）
const KEEPALIVE_INTERVAL_MS = 60 * 1000;
const RECONNECT_INTERVAL_MS = 10 * 1000;

export const DATA_REFRESH_INTERVAL = 1000;

/**
 * 页面关键资源（背景图、视频等）加载完成后 resolve。
 * 各组件在首次 poll 前 await 此 Promise，避免初始资源加载时被 PLC 请求占满连接池。
 */
export const pageReadyPromise = new Promise<void>((resolve) => {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    window.addEventListener('load', () => resolve(), {once: true});
  }
});

// 自增 RPC ID
let _idCounter = 0;
function nextId() {
  return ++_idCounter;
}

// 保活 / 重连定时器
let _keepaliveTimer: ReturnType<typeof setTimeout> | null = null;

// ─── 类型 ────────────────────────────────────────────────────────────────────

interface RpcRequest {
  jsonrpc: '2.0';
  method: string;
  id: number;
  params?: Record<string, any>;
}

interface RpcResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: {code: number; message: string};
}

interface LoginResult {
  token: string;
  runtime_timeout?: string;
  has_no_permissions?: boolean;
}

// ─── 核心 RPC 调用 ────────────────────────────────────────────────────────────

/**
 * 发送单条 JSON-RPC 请求
 * 自动携带当前 Token（由 fetch.ts 中 beforeFetch 注入 X-Auth-Token）
 */
export async function rpc<T = any>(
  method: string,
  params?: Record<string, any>,
): Promise<T> {
  const body: RpcRequest = {
    jsonrpc: '2.0',
    method,
    id: nextId(),
    ...(params ? {params} : {}),
  };

  const {res, err} = await api.post<RpcResponse<T>>(RPC_ENDPOINT, {body});

  if (err) {
    throw new Error(`[PLC] 网络错误: ${err}`);
  }
  if (res?.error) {
    throw new Error(`[PLC] ${method} 失败 (${res.error.code}): ${res.error.message}`);
  }

  return res!.result as T;
}

/**
 * 发送批量 JSON-RPC 请求（单次 HTTP，多条调用）
 */
export async function batchRpc(
  calls: Array<{method: string; params?: Record<string, any>}>,
): Promise<Array<RpcResponse>> {
  const body: RpcRequest[] = calls.map(c => ({
    jsonrpc: '2.0',
    method: c.method,
    id: nextId(),
    ...(c.params ? {params: c.params} : {}),
  }));

  const {res, err} = await api.post<RpcResponse[]>(RPC_ENDPOINT, {body});

  if (err) {
    throw new Error(`[PLC] 网络错误: ${err}`);
  }

  return res!;
}

// ─── 读取变量 ─────────────────────────────────────────────────────────────────

/**
 * 读取 PLC 变量
 *
 * 只需传入变量名（如 `DataR[0]`），数据块名 `"WebData"` 自动拼接。
 *
 * @param variable 变量名，或变量名数组（批量读取），例如 `'DataR[0]'`
 * @param mode     读取模式，默认 'simple'（只返回值）
 */
export async function readVariable<T = any>(variable: string, mode?: PlcReadMode): Promise<T>;
export async function readVariable<T = any>(variable: string[], mode?: PlcReadMode): Promise<T[]>;
export async function readVariable<T = any>(
  variable: string | string[],
  mode: PlcReadMode = 'simple',
): Promise<T | T[]> {
  const toPath = (v: string) => `${DB_NAME}.${v}`;
  if (Array.isArray(variable)) {
    const responses = await batchRpc(
      variable.map(v => ({method: 'PlcProgram.Read', params: {var: toPath(v), mode}})),
    );
    return responses.map((r, i) => {
      if (r.error) {
        throw new Error(`[PLC] 读取 "${variable[i]}" 失败 (${r.error.code}): ${r.error.message}`);
      }
      return r.result as T;
    }) as T[];
  }
  return rpc<T>('PlcProgram.Read', {var: toPath(variable), mode});
}

type PlcReadMode = 'simple' | 'children';

// ─── 登录 & 注销 ──────────────────────────────────────────────────────────────

/**
 * 登录 PLC WebServer，成功后缓存 Token 并启动保活
 */
export async function plcLogin(
  user: string = import.meta.env.VITE_API_USER,
  password: string = import.meta.env.VITE_API_PWD,
): Promise<void> {
  // 登录前先确保旧 Token 被清除（避免发送无效 Token）
  tokenStore.clear();

  const result = await rpc<LoginResult>('Api.Login', {user, password});

  if (!result?.token) {
    throw new Error('[PLC] 登录成功但未返回 Token');
  }

  tokenStore.set(result.token);
  startKeepalive();

  console.info(`[PLC] 登录成功，用户: ${user}`);
}

/**
 * 注销并清除 Token
 */
export async function plcLogout(): Promise<void> {
  stopKeepalive();

  if (!tokenStore.has())
    return;

  try {
    await rpc('Api.Logout');
  } catch (e) {
    // 注销失败（如 Session 已过期）不抛出，直接清除本地状态
    console.warn('[PLC] 注销时发生错误:', e);
  } finally {
    tokenStore.clear();
    console.info('[PLC] 已注销');
  }
}

// ─── 保活 ─────────────────────────────────────────────────────────────────────

/** 调度下一次保活/重连，delay 由调用方根据状态决定 */
function scheduleNext(delay: number) {
  _keepaliveTimer = setTimeout(keepaliveTask, delay);
}

async function keepaliveTask() {
  _keepaliveTimer = null;

  // 无 Token：初始登录失败或 Session 已失效 → 10s 重连
  if (!tokenStore.has()) {
    try {
      await plcLogin(); // 成功后 plcLogin 内部调用 startKeepalive，切换至 60s 保活
    } catch (e) {
      console.warn('[PLC] 重连尝试失败，10s 后重试...', e);
      scheduleNext(RECONNECT_INTERVAL_MS);
    }
    return;
  }

  // 有 Token：发送 Ping 保活
  try {
    await rpc<string>('Api.Ping');
    scheduleNext(KEEPALIVE_INTERVAL_MS);
  } catch (e) {
    // Ping 失败 → Session 可能已过期，清除 Token，10s 后重新登录
    console.warn('[PLC] Keepalive Ping 失败，将在 10s 后重新登录...', e);
    tokenStore.clear();
    scheduleNext(RECONNECT_INTERVAL_MS);
  }
}

function startKeepalive() {
  stopKeepalive(); // 防止重复启动
  scheduleNext(KEEPALIVE_INTERVAL_MS);
}

function stopKeepalive() {
  if (_keepaliveTimer !== null) {
    clearTimeout(_keepaliveTimer);
    _keepaliveTimer = null;
  }
}

// ─── 初始化入口 ───────────────────────────────────────────────────────────────

/**
 * 应用启动时调用，完成首次登录
 * 建议在 main.ts 中 app.mount() 之前 await 本函数
 *
 * 若 PLC 尚未上线导致初始登录失败，会启动保活定时器持续重连，
 * 待 PLC 上线后自动恢复认证，无需重启大屏。
 */
export async function initPlcAuth(): Promise<void> {
  try {
    await plcLogin();
  } catch (e) {
    // 初始登录失败（PLC 未启动等），启动保活定时器以便 PLC 上线后自动重连
    console.warn('[PLC] 初始登录失败，将每隔', KEEPALIVE_INTERVAL_MS / 1000, 's 自动重试...', e);
    startKeepalive();
    throw e;
  }
}
