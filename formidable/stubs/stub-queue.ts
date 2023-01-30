import { Queueable } from '@formidablejs/queues'

export class {{class}} extends Queueable {
    /**
     * Queue name.
     */
    get queue(): string {
        return '{{queue}}'
    }

    /**
     * Handle job.
     */
    handle(): any {
        console.log('job...')
    }
}
