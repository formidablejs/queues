// @ts-nocheck

import { QueueWork } from './Commands/QueueWork'
import { DuplicateQueueException } from './Errors/DuplicateQueueException'
import type BeeQueue from 'bee-queue'
const bee = require('bee-queue')

const settings = {
	default: null,
	queues: {}
}

/**
 * Create a new queue.
 */
const createQueue = (name: string, config) => {
	if (settings.queues[name]) {
		throw new DuplicateQueueException(`Queue "${name}" already exists.`)
	}

	const queue = new bee(name, config)

	settings.queues[name] = queue
}

/**
 * Get queue.
 */
const queue = (name?: string): BeeQueue<any> => {
	if (!name) {
		name = settings.default
	}

	return settings.queues[name]
}

/**
 * Get registered queues.
 */
const registered = (): string[] => {
	return Object.keys(settings.queues)
}

class Queue {
	/**
 	* Add on ready event.
 	*/
	static onReady(callback: CallableFunction): void {
		QueueWork.onReady(callback)
	}

	/**
 	* Add on error event.
 	*/
	static onError(callback: CallableFunction): void {
		QueueWork.onError(callback)
	}

	/**
 	* Add on log event.
 	*/
	 static onLog(callback: CallableFunction): void {
		QueueWork.onLog(callback)
	}
}

export {
	createQueue,
	Queue,
	queue,
	registered
}
