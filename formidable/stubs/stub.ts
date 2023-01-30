import { Queueable } from '@formidablejs/queues'

export class {{class}} extends Queueable {
    /**
     * Handle job.
     */
    handle(): any {
        console.log('job...')
    }
}
