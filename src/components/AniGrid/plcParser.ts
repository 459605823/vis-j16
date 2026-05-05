/**
 * PLC WORD 变量解析工具
 * 用于解析 DataW[0-3] 变量并映射到动画状态
 */

/**
 * 提取 WORD 中指定位的值
 * @param word WORD 值 (0-65535)
 * @param bitIndex 位索引 (0-15)，0 表示最低位
 * @returns 该位是否为 1
 */
export function getBit(word: number, bitIndex: number): boolean {
  return (word & (1 << bitIndex)) !== 0;
}

/**
 * 动画项状态类型
 */
export type AnimationStatus = 'pending' | 'success' | 'error';

/**
 * 动画项数据结构
 */
export interface AnimationItem {
  name: string;
  status: AnimationStatus;
  playing: boolean; // 是否正在播放视频
}

/**
 * PLC 数据结构
 */
export interface PlcWordData {
  dataW0: number; // 动作进程
  dataW1: number; // 前起落架到位信号
  dataW2: number; // 左起落架到位信号
  dataW3: number; // 右起落架到位信号
}

/**
 * 解析结果结构
 */
export interface ParsedAnimationData {
  front: AnimationItem[];
  left: AnimationItem[];
  right: AnimationItem[];
}

/**
 * 解析 PLC WORD 数据为动画状态
 * @param data PLC WORD 数据
 * @returns 解析后的三组动画数据
 */
export function parsePlcData(data: PlcWordData): ParsedAnimationData {
  const {dataW0, dataW1, dataW2, dataW3} = data;

  // DataW[0] - 动作进程
  const doorOpening = getBit(dataW0, 0); // 舱门开启动作中
  const doorClosing = getBit(dataW0, 1); // 舱门关闭动作中
  const gearUp = getBit(dataW0, 2); // 起落架升起动作中
  const gearDown = getBit(dataW0, 3); // 起落架落下动作中

  // DataW[1] - 前起落架到位信号
  const frontDoorOpenDone = getBit(dataW1, 0); // 前舱门开启到位
  const frontDoorCloseDone = getBit(dataW1, 1); // 前舱门关闭到位
  const frontGearUpDone = getBit(dataW1, 8); // 前起落架升起到位
  const frontGearDownDone = getBit(dataW1, 9); // 前起落架落下到位

  // DataW[2] - 左起落架到位信号（双门取 AND）
  const leftDoor1OpenDone = getBit(dataW2, 0); // 左舱门1开启到位
  const leftDoor2OpenDone = getBit(dataW2, 3); // 左舱门2开启到位
  const leftDoorOpenDone = leftDoor1OpenDone && leftDoor2OpenDone; // 两门都开才算开

  const leftDoor1CloseDone = getBit(dataW2, 1); // 左舱门1关闭到位
  const leftDoor2CloseDone = getBit(dataW2, 4); // 左舱门2关闭到位
  const leftDoorCloseDone = leftDoor1CloseDone && leftDoor2CloseDone; // 两门都关才算关

  const leftGearUpDone = getBit(dataW2, 8); // 左起落架升起到位
  const leftGearDownDone = getBit(dataW2, 9); // 左起落架落下到位

  // DataW[3] - 右起落架到位信号（双门取 AND）
  const rightDoor1OpenDone = getBit(dataW3, 0); // 右舱门1开启到位
  const rightDoor2OpenDone = getBit(dataW3, 3); // 右舱门2开启到位
  const rightDoorOpenDone = rightDoor1OpenDone && rightDoor2OpenDone; // 两门都开才算开

  const rightDoor1CloseDone = getBit(dataW3, 1); // 右舱门1关闭到位
  const rightDoor2CloseDone = getBit(dataW3, 4); // 右舱门2关闭到位
  const rightDoorCloseDone = rightDoor1CloseDone && rightDoor2CloseDone; // 两门都关才算关

  const rightGearUpDone = getBit(dataW3, 8); // 右起落架升起到位
  const rightGearDownDone = getBit(dataW3, 9); // 右起落架落下到位

  /**
   * 计算单个动画项的状态
   * @param isDoing 是否正在执行动作
   * @param isDone 是否已完成到位
   */
  function calculateStatus(isDoing: boolean, isDone: boolean): AnimationStatus {
    if (isDone) {
      return 'success'; // 已到位
    }
    return 'pending'; // 未激活或未到位
  }

  return {
    front: [
      {
        name: '前舱门开',
        status: calculateStatus(doorOpening, frontDoorOpenDone),
        playing: doorOpening && !frontDoorOpenDone, // 动作中且未到位时播放
      },
      {
        name: '前舱门关',
        status: calculateStatus(doorClosing, frontDoorCloseDone),
        playing: doorClosing && !frontDoorCloseDone,
      },
      {
        name: '前起落架升起',
        status: calculateStatus(gearUp, frontGearUpDone),
        playing: gearUp && !frontGearUpDone,
      },
      {
        name: '前起落架落下',
        status: calculateStatus(gearDown, frontGearDownDone),
        playing: gearDown && !frontGearDownDone,
      },
    ],
    left: [
      {
        name: '左舱门开',
        status: calculateStatus(doorOpening, leftDoorOpenDone),
        playing: doorOpening && !leftDoorOpenDone,
      },
      {
        name: '左舱门关',
        status: calculateStatus(doorClosing, leftDoorCloseDone),
        playing: doorClosing && !leftDoorCloseDone,
      },
      {
        name: '左起落架升起',
        status: calculateStatus(gearUp, leftGearUpDone),
        playing: gearUp && !leftGearUpDone,
      },
      {
        name: '左起落架落下',
        status: calculateStatus(gearDown, leftGearDownDone),
        playing: gearDown && !leftGearDownDone,
      },
    ],
    right: [
      {
        name: '右舱门开',
        status: calculateStatus(doorOpening, rightDoorOpenDone),
        playing: doorOpening && !rightDoorOpenDone,
      },
      {
        name: '右舱门关',
        status: calculateStatus(doorClosing, rightDoorCloseDone),
        playing: doorClosing && !rightDoorCloseDone,
      },
      {
        name: '右起落架升起',
        status: calculateStatus(gearUp, rightGearUpDone),
        playing: gearUp && !rightGearUpDone,
      },
      {
        name: '右起落架落下',
        status: calculateStatus(gearDown, rightGearDownDone),
        playing: gearDown && !rightGearDownDone,
      },
    ],
  };
}
