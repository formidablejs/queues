export type SyncConnection = {
    driver: 'sync',
    queue: string,
    timeout?: number,
    retries?: number
}

export type RedisConnection = {
    driver: 'redis',
    queue: string,
    redis: string,
    timeout?: number,
    retries?: number,
    stallInterval?: number,
    nearTermWindow?: number,
    delayedDebounce?: number
}

export type Connection = SyncConnection | RedisConnection
