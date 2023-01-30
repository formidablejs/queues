// @ts-nocheck

import { Command } from '@formidablejs/framework'
import { Prop } from '@formidablejs/framework'
import { Job } from 'bee-queue'
import { Queueable } from '../Queueable'
import { queue, registered } from '../Queue'

const settings = {
	jobs: [],
}

export class QueueRetry extends Command {
	/**
	 * Command signature.
	 */
	get signature(): string {
		return 'queue:retry {?--queue}'
	}

	/**
	 * Command description.
	 */
	get description(): string {
		return 'Retry failed queue jobs'
	}

	/**
	 * Command properties.
	 */
	get props(): object {
		return {
			queue: Prop.string().multiple().default('default').description('The name of the queue to work'),
		}
	}

	/**
	 * Load registered jobs.
	 */
	static registerJobs(jobs: Array<typeof Queueable>): void {
		settings.jobs = settings.jobs.concat(jobs)
	}

	/**
	 * Handle command.
	 */
	async handle(): Promise<void> {
		let queueNames: string[] = Array.isArray(this.option('queue'))
			? this.option('queue')
			: [
				this.option('queue')
			]

		const queues = registered()

		let index: number = 0, length: number = queueNames.length

		while(index < length) {
			if (!queues.includes(queueNames[index])) {
				this.message('error', `Queue not registered: ${queueNames[index]}`)

				this.exit(1)
			}

			index++;
		}

		this.message('info', `Retrying jobs from the [${queueNames.join(', ')}] ${length > 1 ? 'queues' : 'queue'}`)

		for (const q of queueNames) {
			await this.retry(q)
		}

		this.exit()
	}

	/**
	 * Attempt to retry failed jobs.
	 */
	async retry(queueName: string): Promise<void> {
		const worker = queue(queueName)

		const failed = await worker.getJobs('failed', {})

		const all = []

		for (const job of failed) {
			all.push(this.createJob(job))
		}

		await Promise.all(all)
	}

	/**
	 * Create new job.
	 */
	async createJob(job: Job<any>): Promise<void> {
		const id = job.id
		const payload = job.data.payload

		let registeredJob: typeof Queueable

		for (const queueableJob of settings.jobs) {
			if (queueableJob._jobName() == job.data.name) {
				registeredJob = queueableJob
			}
		}

		await job.remove()

		const args = [
			{
				_referredId: id
			}
		].concat(payload ?? [])

		return await registeredJob.dispatch.apply(registeredJob, args)
	}
}
