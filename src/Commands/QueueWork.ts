// @ts-nocheck

import { Command } from '@formidablejs/framework'
import { Prop } from '@formidablejs/framework'
import { Queueable } from '../Queueable'
import { queue, registered } from '../Queue'

const settings = {
	jobs: [],
	onReady: null,
	onError: null,
	onLog: null
}

export class QueueWork extends Command {
	/**
	 * Command signature.
	 */
	get signature(): string {
		return 'queue:work {?--queue} {?--concurrency}'
	}

	/**
	 * Command description.
	 */
	get description(): string {
		return 'Start processing jobs on the queue as a worker'
	}

	/**
	 * Command properties.
	 */
	get props(): object {
		return {
			queue: Prop.string().multiple().default('default').description('The name of the queue to work'),
			concurrency: Prop.number().default(1).description('The maximum number of simultaneously active jobs for this processor')
		}
	}

	/**
	 * Load registered jobs.
	 */
	static registerJobs(jobs: Array<typeof Queueable>): void {
		settings.jobs = settings.jobs.concat(jobs)
	}

	/**
	 * Add on ready event.
	 */
	static onReady(callback: CallableFunction): void {
		if (settings.onReady) {
			throw new Error('onReady event is already registered')
		}

		settings.onReady = callback
	}

	/**
	 * Add on error event.
	 */
	static onError(callback: CallableFunction): void {
		if (settings.onError) {
			throw new Error('onError event is already registered')
		}

		settings.onError = callback
	}

	/**
	 * Add on log event.
	 */
	static onLog(callback: CallableFunction): void {
		if (settings.onLog) {
			throw new Error('onLog event is already registered')
		}

		settings.onLog = callback
	}

	/**
	 * Write to log.
	 */
	jobLog(job, queueName: string, type: string): void {
		if (settings.onLog) {
			settings.onLog(queueName, job, type)

			return
		}

		const columns = process.stdout.columns

		const date = new Date()
		const dateString = `${date.toLocaleDateString().replace(/\//g, '-')} ${date.toLocaleTimeString()}`
		const repeatLength = columns - (type.length + job.data.name.length + queueName.length + dateString.length + 6)

		this.write(`<dim>${dateString} ${type}${repeatLength < 0 ? '' : (' ' + '.'.repeat(repeatLength))} ${queueName} › ${job.data.name}</dim>`)
	}

	/**
	 * Handle command.
	 */
	handle(): void {
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

		this.message('info', `Processing jobs from the [${queueNames.join(', ')}] ${length > 1 ? 'queues' : 'queue'}`)

		const jobs = settings.jobs

		if (jobs.length < 1) {
			throw new Error('No jobs registered')
		}

		Object
			.values(queueNames)
			.forEach((q) => this.work(q, jobs))
	}

	/**
	 * Process queue.
	 */
	work(queueName: string, jobs: Array<typeof Queueable> = []): void {
		const worker = queue(queueName)

		if (settings.onReady) {
			worker.on('ready', async () => {
				await settings.onReady(queueName)
			})
		}

		worker.on('failed', async (job, error) => {
			this.jobLog(job, queueName, 'Failed')

			if (job.options.retries || job.status == 'retrying') {
				return
			}

			if (settings.onError) {
				await settings.onError(queueName, job, error)
			} else {
				throw error
			}
		})

		worker.on('succeeded', (job) => {
			this.jobLog(job, queueName, 'Processed')
		})

		worker.on('retrying', (job) => {
			this.jobLog(job, queueName, 'Retrying')
		})

		worker.process(this.option('concurrency', 1), async (job) => {
			this.jobLog(job, queueName, 'Processing')

			let queued: Queueable

			for (let index = 0; index < jobs.length; index++) {
				if (jobs[index]._jobName() == job.data.name) {
					queued = new jobs[index]

					break;
				}
			}

			if (!queued) {
				throw new Error('Unhandled job')
			}

			queued._setJobId(job.id)

			await queued.handle.apply(queued, job.data.payload)
		})

		process.on('SIGINT', async () => {
			this.message('info', `Stopping [${queueName}] queue`)

			await worker.close(30 * 1000)
		})
	}
}
