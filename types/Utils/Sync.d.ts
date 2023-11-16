declare function delayAndRetry<T>(func: () => Promise<T>, retries: number, delayMs: number, timeoutMs: number): Promise<T | Awaited<T> | void>;
export { delayAndRetry };
