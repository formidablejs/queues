// @ts-nocheck

import { Command } from '@formidablejs/framework'
import { queue, registered } from '../Queue'

export class QueueAbout extends Command {
	/**
	 * Command signature.
	 */
	get signature(): string {
		return 'queue:about'
	}

	/**
	 * Command description.
	 */
	get description(): string {
		return 'Details about registered queues'
	}

	/**
	 * Command properties.
	 */
	get props(): object {
		return {

		}
	}

	/**
	 * Print information.
	 */
	print(key:string, value:string) {
		const columns = process.stdout.columns

		const repeatLength = columns - (key.length + value.length + 2)

		this.write(`${key}<dim>${repeatLength < 0 ? '' : (' ' + '.'.repeat(repeatLength))}</dim> ${value}`)
	}

	/**
	 * Handle command.
	 */
	async handle(): Promise<void> {
		const queues = registered()

		let active = 0
		let queued = 0
		let failed = 0
		let delayed = 0

		for (const key in queues) {
			const q = queue(queues[key])

			active += (await q.checkHealth()).active
			queued += (await q.checkHealth()).waiting
			failed += (await q.checkHealth()).failed
			delayed += (await q.checkHealth()).delayed
		}

		this.message('info', `Queue [${queues.join(', ')}] Information`)

		this.print('Active Jobs', `${active}`)
		this.print('Queued Jobs', `${queued}`)
		this.print('Failed Jobs', `${failed}`)
		this.print('Delayed Jobs', `${delayed}`)

		console.log('')

		this.exit()
	}
}
