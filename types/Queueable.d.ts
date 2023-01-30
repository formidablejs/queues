import { Job } from 'bee-queue';
export declare class Queueable {
    /**
     * Delay value.
     */
    private _delay: number;
    /**
     * Job ID.
     */
    private _id: number | string;
    /**
     * Set job id.
     */
    private _setJobId(id: number | string): void;
    /**
	 * Job id.
	 */
    get id(): number | string;
    /**
     * Queue to run job on.
     */
    get queue(): string;
    /**
     * The number of times the job should be retried.
     */
    get retries(): number;
    /**
     * The timeout time for the job.
     */
    get timeout(): number | string;
    /**
     * Handle job.
     */
    handle(...args: any[]): any;
    /**
     * Get job name.
     */
    private static _jobName(): string;
    /**
     * Get queue name.
     */
    private static get queueName(): string;
    /**
     * Initiate new job.
     */
    private static _initiateJob(...args: any[]): Job<any>;
    /**
     * Delay job.
     */
    static delay(delay: string): typeof Queueable;
    /**
     * Dispatch job.
     */
    static dispatch(...args: any[]): Promise<Job<any>>;
     /**
     * Dispatch job.
     */
    dispatch(...args: any[]): Promise<Job<any>>;
}
