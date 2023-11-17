// @ts-nocheck

import { ms } from '@formidablejs/framework/lib/Support/Helpers'
import { delayAndRetry } from './Utils/Sync'
import { config } from "@formidablejs/framework"
import { queue } from "./Queue"
import { Job } from 'bee-queue'
import type { Connection } from '../types/Common/Connection'

export class Queueable {
	/**
	 * Delay value.
	 */
	private _delay: number

	/**
	 * Job ID.
	 */
	_id: number | string

	/**
	 * Set job id.
	 */
	_setJobId(id: number | string): void {
		this._id = id
	}

	/**
	 * Set job delay value.
	 */
	_setDelay(delay: number): void {
		this._delay = delay
	}

	/**
	 * Job id.
	 */
	get id(): number | string {
		return this._id
	}

	/**
	 * Handle job.
	 */
	handle(...args): any {

	}

	/**
	 * Get job name.
	 */
	static _jobName(): string {
		return this.name
	}

	/**
	 * Get queue connection.
	 */
	private get _connection(): Connection {
		if (!this.queue) {
			return config(`queue.connections.${config('queue.default')}`)
		}

		const connections = config('queue.connections')

		let current = {}

		for (const key of Object.keys(connections)) {
			if (connections[key].queue == this.queue) {
				current = connections[key]

				break;
			}
		}

		return current ?? config(`queue.connections.${config('queue.default')}`)
	}

	/**
	 * Get queue name.
	 */
	get queueName(): string {
		if (this.queue && typeof this.queue === 'string') {
			return this.queue
		}

		const defaultConnection = config('queue.default')

		const connection = config(`queue.connections.${defaultConnection}`)

		return connection.queue
	}

	/**
	 * Get queue driver.
	 */
	get queueDriver(): string {
		if (this.queue && typeof this.queue === 'string') {
			return this._connection.driver ?? 'redis'
		}

		const defaultConnection = config('queue.default')

		const connection =  config(`queue.connections.${defaultConnection}`)

		return connection.driver ?? 'redis'
	}

	/**
	 * Get queue timeout.
	 */
	get queueTimeout(): number {
		if (this.queue && typeof this.queue === 'string') {
			return this._connection.timeout ?? 3000
		}

		const defaultConnection = config('queue.default')

		const connection = config(`queue.connections.${defaultConnection}`)

		return connection.timeout ?? 3000
	}

	/**
	 * Get queue retries.
	 */
	get queueRetries(): number {
		if (this.queue && typeof this.queue === 'string') {
			return this._connection.retries ?? 0
		}

		const defaultConnection = config('queue.default')

		const connection = config(`queue.connections.${defaultConnection}`)

		return connection.retries ?? 0
	}

	/**
	 * Initiate new job.
	 */
	_initiateJob(...args): Job<any> {
		return queue(this.queueName).createJob({
			name: this.constructor._jobName(),
			payload: args
		})
	}

	/**
	 * Delay job.
	 */
	static delay(delay: string): Queueable {
		const job = new this

		job._setDelay(
			job.queueDriver == 'sync'
				? ms(delay)
				: Date.now() + ms(delay)
		)

		return job
	}

	/**
	 * Connection
	 */
	get connection(): object {
		const connections = config('queue.connections')

		let current = {}

		for (const key of Object.keys(connections)) {
			if (connections[key].queue == this.queueName) {
				current = connections[key]

				break;
			}
		}

		return current
	}

	/**
	 * Dispatch job.
	 */
	static async dispatch<T = unknown>(...args): Promise<Job<any> | T> {
		const job = new this

		return await job.dispatch.apply(job, args)
	}

	/**
	 * Dispatch job.
	 */
	async dispatch<T = unknown>(...args): Promise<Job<any> | T> {
		let _referredId = null

		if (args.length > 0 && args[0]._referredId) {
			_referredId = args[0]._referredId

			args.shift()
		}

		const timeout = this.timeout ? this.timeout : (this.queueTimeout ? this.queueTimeout : 3000)

		const retries = this.retries ? this.retries : this.queueRetries

		const driver = this.queueDriver

		if (driver === 'sync') {
			return delayAndRetry(async () => this.handle.apply(this, args), retries, this._delay, timeout)
		}

		const job = this._initiateJob(...args)

		job.timeout(isNaN(timeout) ? ms(timeout) : timeout)

		job.retries(retries)

		if (this._delay) {
			job.delayUntil(this._delay)
			this._delay = null
		}

		if (_referredId) {
			job.setId(_referredId)
		}

		return await job.save()
	}
}
