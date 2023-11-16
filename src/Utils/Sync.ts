const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

async function delayAndRetry<T>(func: () => Promise<T>, retries: number, delayMs: number, timeoutMs: number): Promise<T | void> {
    try {
        if (delayMs > 0) {
            await delay(delayMs);
        }

        // track the timeout
        let hasTimedOut = false
        const timeoutPromise = delay(timeoutMs).then(() => {
            hasTimedOut = true;
        });

        // Call the provided function with a timeout
        const result = await Promise.race([func(), timeoutPromise]);

        if (result === undefined && hasTimedOut) {
            throw new Error('Operation timed out.');
        }

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
