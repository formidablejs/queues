import { ConsoleKernel } from '@formidablejs/framework'
import { Queueable } from '../../../src'
import { LogMessage } from '../LogMessage'

export class Kernel extends ConsoleKernel {
	get registered(): Array<object> {
		return [

		]
	}

	get jobs(): Array<typeof Queueable> {
		return [
			LogMessage
		]
	}

	schedule(schedule): void {
		//
	}
}
