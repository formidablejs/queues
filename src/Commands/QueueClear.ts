// @ts-nocheck

import { Command } from '@formidablejs/framework'
import { Prop } from '@formidablejs/framework'
import { queue } from '../Queue'

export class QueueClear extends Command {
	/**
	 * Command signature.
	 */
	get signature(): string {
		return 'queue:clear {?--queue}'
	}

	/**
	 * Command description.
	 */
	get description(): string {
		return 'Clear all queued jobs'
	}

	/**
	 * Command properties.
	 */
	get props(): object {
		return {
			queue: Prop.string().default('default').description('The name of the queue to work'),
		}
	}

	/**
	 * Handle command.
	 */
	async handle(): Promise<void> {
		await Promise.all([
			this.clear('delayed'),
			this.clear('waiting'),
		])

		this.message('info', 'Queued jobs removed successfully!')

		this.exit()
	}

	/**
	 * Clear jobs.
	 */
	async clear(type: 'delayed' | 'waiting'): Promise<void> {
		const worker = queue(this.option('queue', 'default'))

		const jobs = await worker.getJobs(type, { start: 0 })

		const all = []

		for (let index = 0; index < jobs.length; index++) {
			const job = jobs[index];

			all.push(job.remove())
		}

		await Promise.all(all)
	}
}
