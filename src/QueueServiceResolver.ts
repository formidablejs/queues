// @ts-nocheck

import { ConsoleKernel, Redis, ServiceResolver, slug } from '@formidablejs/framework'
import { createQueue } from './Queue'
import { Generator } from './Commands/Generator'
import { QueueAbout } from './Commands/QueueAbout'
import { QueueFlush } from './Commands/QueueFlush'
import { QueueRetry } from './Commands/QueueRetry'
import { QueueWork } from './Commands/QueueWork'

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
			const config = queues[queue]

			if (!this.app.config.get(`database.redis.${config.redis}`, null)) {
				throw new Error(`Invalid redis database: ${config.redis}`)
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
		this.app.registerCommand(QueueFlush)
		this.app.registerCommand(QueueRetry)
		this.app.registerCommand(QueueWork)
	}
}
