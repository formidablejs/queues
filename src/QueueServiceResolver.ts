// @ts-nocheck

import { ConsoleKernel, Redis, ServiceResolver, env, slug } from '@formidablejs/framework'
import { createQueue } from './Queue'
import { Generator } from './Commands/Generator'
import { QueueAbout } from './Commands/QueueAbout'
import { QueueFlush } from './Commands/QueueFlush'
import { QueueRetry } from './Commands/QueueRetry'
import { QueueWork } from './Commands/QueueWork'
import { QueueClear } from './Commands/QueueClear'
import { isEmpty } from '@formidablejs/framework/lib/Support/Helpers'
import { InvalidQueueConfigurationException } from './Errors/InvalidQueueConfigurationException'
import type { Connection } from '../types/Common/Connection'

const redisConnections = { }

export class QueueServiceResolver extends ServiceResolver {
	/**
	 * Boot up the queue service resolver.
	 */
	boot(): void {
		QueueRetry.registerJobs(this.app.make(ConsoleKernel).jobs)
		QueueWork.registerJobs(this.app.make(ConsoleKernel).jobs)

		const queues = this.app.config.get('queue.connections', {})

		Object.keys(queues).forEach((queue) => {
			const config: Connection = queues[queue]

			if (config.driver !== 'redis' || env('QUEUE_REDIS', true) === false) {
				return
			}

			if (config.driver == 'redis' && isEmpty(config.redis)) {
				throw new InvalidQueueConfigurationException(`Invalid redis connection for queue: ${queue}`)
			}

			if (!this.app.config.get(`database.redis.${config.redis}`, null)) {
				throw new InvalidQueueConfigurationException(`Invalid redis database: ${config.redis}`)
			}

			/** add redis instance for a new queue. */
			if (!redisConnections[config.redis]) {
				redisConnections[config.redis] = Redis.connection(config.redis)
			}

			/** configure queue. */
			const settings = {
				prefix: slug(`${this.app.config.get('app.name', 'formidable')} ${config.queue} worker`, '_'),
				stallInterval: config.stallInterval ?? 5000,
				nearTermWindow: config.nearTermWindow ?? 1200000,
				delayedDebounce: config.delayedDebounce ?? 1000,
				isWorker: true,
				ensureScripts: true,
				activateDelayedJobs: true,
				removeOnSuccess: true,
				redis: redisConnections[config.redis]
			}

			/** create a new queue, */
			createQueue(config.queue, settings)
		})
	}

	/**
	 * Register queue related commands.
	 */
	register(): void {
		this.app.registerCommand(Generator)
		this.app.registerCommand(QueueAbout)
		this.app.registerCommand(QueueClear)
		this.app.registerCommand(QueueFlush)
		this.app.registerCommand(QueueRetry)
		this.app.registerCommand(QueueWork)
	}
}
