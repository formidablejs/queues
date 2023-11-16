const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

async function delayAndRetry<T>(func: () => Promise<T>, retries: number, delayMs: number, timeoutMs: number): Promise<T | void> {
    try {
        if (delayMs > 0) {
            await delay(delayMs);
        }

        // Call the provided function with a timeout
        const result = await Promise.race([func(), delay(timeoutMs)]);
        return result;
    } catch (error) {
        // Retry if there are remaining retries
        if (retries > 0) {
            // Retry with decremented retries
            return delayAndRetry(func, retries - 1, delayMs, timeoutMs);
        } else {
            throw error;
        }
    }
}

export { delayAndRetry };
