import { Command } from '@formidablejs/framework';
export declare class QueueWork extends Command {
    /**
     * Command signature.
     */
    get signature(): string;
    /**
     * Command description.
     */
    get description(): string;
    /**
     * Command properties.
     */
    get props(): object;
    /**
     * Write to log.
     */
    jobLog(job: any, queueName: string, type: string): void;
    /**
     * Handle command.
     */
    handle(): void;
    /**
     * Process queue.
     */
    work(queueName: string): void;
}
