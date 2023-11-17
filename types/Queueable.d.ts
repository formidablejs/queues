import { Job } from 'bee-queue';

type Connection = {
	driver: 'sync',
	queue: string,
	timeout?: number,
	retries?: number
} | {
	driver: 'redis',
	queue: string,
	redis: string,
	timeout?: number,
	retries?: number
}

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
     * Get queue connection.
     */
    private _connection(): Connection;
    /**
     * Get queue name.
     */
    private static get queueName(): string;
    /**
	 * Get queue driver.
	 */
    get queueDriver(): string;
    /**
	 * Get queue timeout.
	 */
    get queueTimeout(): number | string;
    /**
	 * Get queue retries.
	 */
    get queueRetries(): number;
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
    static dispatch<T = unknown>(...args: any[]): Promise<Job<any> | T>;
     /**
     * Dispatch job.
     */
    dispatch<T = unknown>(...args: any[]): Promise<Job<any> | T>;
}

export {
    Connection
}