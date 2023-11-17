// @ts-nocheck

import { Queueable } from '../../src'

export class SayHello extends Queueable {
    /**
     * Queue to run job on.
     */
    get queue(): string {
        return 'sync'
    }

    /**
     * Handle job.
     */
    async handle(name: ?string): any {
        console.log(name ? `Hello ${name}` : 'this logs a message...')
    }
}
