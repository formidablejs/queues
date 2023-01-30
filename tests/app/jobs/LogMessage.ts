import { Queueable } from '../../../src'

export class LogMessage extends Queueable {
    /**
     * Handle job.
     */
    handle(): any {
        console.log('this logs a message...')
    }
}
