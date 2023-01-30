import { Command } from '@formidablejs/framework';
export declare class QueueRetry extends Command {
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
     * Handle command.
     */
    handle(): void;
    /**
     * Attempt to retry failed jobs.
     */
    retry(queueName: string): void;
    /**
	 * Create new job.
	 */
	async createJob(job: Job<any>): Promise<Job<any>>;
}
