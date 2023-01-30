import { Queueable } from '@formidablejs/queues'

export class {{class}} < Queueable

	# Handle job.
	def handle\any
		console.log('job...')
