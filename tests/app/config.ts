import { ConfigRepository, RedisServiceResolver, env, slug } from '@formidablejs/framework'
import { QueueServiceResolver } from '../../src'

export class Config extends ConfigRepository {
    get registered() {
        return {
            app: {
                resolvers: [
                    RedisServiceResolver,
                    QueueServiceResolver
                ]
            },
            database: {
                redis: {
                    options: {
                        prefix: env('REDIS_PREFIX', slug('formidable queue test', '_') + '_database_')
                    },
                    default: {
                        url: env('REDIS_URL'),
                        host: env('REDIS_HOST', '127.0.0.1'),
                        password: env('REDIS_PASSWORD', null),
                        port: env('REDIS_PORT', '6379'),
                        database: env('REDIS_DB', '0')
                    },
                    cache: {
                        url: env('REDIS_URL'),
                        host: env('REDIS_HOST', '127.0.0.1'),
                        password: env('REDIS_PASSWORD', null),
                        port: env('REDIS_PORT', '6379'),
                        database: env('REDIS_CACHE_DB', '1')
                    },
                    queue: {
                        url: env('REDIS_URL'),
                        host: env('REDIS_HOST', '127.0.0.1'),
                        password: env('REDIS_PASSWORD', null),
                        port: env('REDIS_PORT', '6379'),
                        database: env('REDIS_CACHE_DB', '2')
                    }
                }
            },
            queue: {
                default: 'default',
                connections: {
                    default: {
                        queue: 'default',
                        redis: 'queue',
                        timeout: 3000,
                        retries: 3
                    }
                }
            }
        }
    }
}
