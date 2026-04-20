/**
 * PLC WebServer 认证 Token 的轻量存储
 * 独立模块，避免循环依赖：fetch.ts 和 plc-auth.ts 都可以安全引入
 */

let _token = '';

export const tokenStore = {
  get: () => _token,
  set: (token: string) => {
    _token = token;
  },
  clear: () => {
    _token = '';
  },
  has: () => _token !== '',
};
