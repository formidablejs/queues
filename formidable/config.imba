import { env } from '@formidablejs/framework'

export default {

	# --------------------------------------------------------------------------
	# Default Queue Connection Name
	# --------------------------------------------------------------------------
	#
	# Here you may specify which of the queue connections below you wish
	# to use as your default connection for all queue workers.

	default: env('QUEUE_CONNECTION', 'default')

	# --------------------------------------------------------------------------
	# Queue Connections
	# --------------------------------------------------------------------------
	#
	# Here are each of the queue connections setup for your application.
	# Feel free to add more.

	connections: {
		default: {
			driver: 'redis'
			queue: 'default'
			redis: 'queue'
			timeout: 3000
			retries: 3
		}

		sync: {
			driver: 'sync'
			queue: 'sync'
			timeout: 3000
			retries: 3
		}
	}

}
