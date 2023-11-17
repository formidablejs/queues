// @ts-nocheck

import { Command } from '@formidablejs/framework'
import { Prop } from '@formidablejs/framework'
import { queue } from '../Queue'
import { connection } from '../Utils/connection'

export class QueueFlush extends Command {
	/**
	 * Command signature.
	 */
	get signature(): string {
		return 'queue:flush {?--queue}'
	}

	/**
	 * Command description.
	 */
	get description(): string {
		return 'Flush all of the failed queue jobs'
	}

	/**
	 * Command properties.
	 */
	get props(): object {
		return {
			queue: Prop.string().default(connection().queue ?? 'default').description('The name of the queue to work'),
		}
	}

	/**
	 * Handle command.
	 */
	async handle(): Promise<void> {
		const worker = queue(this.option('queue', connection().queue))

		const jobs = await worker.getJobs('failed', { start: 0 })

		const all = []

		for (let index = 0; index < jobs.length; index++) {
			const job = jobs[index];

			all.push(job.remove())
		}

		await Promise.all(all)

		this.message('info', 'Failed jobs removed successfully!')

		this.exit()
	}
}
