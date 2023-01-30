import { Queueable } from '@formidablejs/queues'

export class {{class}} < Queueable

	# Queue name
	get queue\string
		'{{queue}}'

	# Handle job.
	def handle\any
		console.log('job...')
