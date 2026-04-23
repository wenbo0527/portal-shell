/**
 * Mock 工具函数
 */

/**
 * 模拟延迟
 */
export function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 生成随机 ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * 随机选取数组元素
 */
export function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 随机布尔值
 */
export function randomBool(probability: number = 0.5): boolean {
  return Math.random() < probability;
}
