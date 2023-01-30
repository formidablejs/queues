import { Job } from "bee-queue";

/**
 * Create a new queue.
 */
declare const createQueue: (name: string, config: any) => void;
/**
 * Get queue.
 */
declare const queue: (name?: string) => BeeQueue<any>;
/**
 * Get registered queues.
 */
declare const registered: () => string[];

/**
 * onReadyCallback type.
 */
type onReadyCallback = (queueName: string) => void

/**
 * onErrorCallback type.
 */
type onErrorCallback = (queueName: string, job: Job<any>, error: Error) => void

/**
 * Log type.
 */
type LogType = 'Failed' | 'Processed' | 'Retrying' | 'Processing'

/**
 * onLogCallback type.
 */
type onLogCallback = (queueName: string, job: Job<any>, type: LogType) => void

declare class Queue {
    /**
     * Add on ready event.
     */
    static onReady: (callback: onReadyCallback) => void;

    /**
     * Add on error event.
     */
    static onError: (callback: onErrorCallback) => void;

    /**
     * Add on log event.
     */
    static onLog: (callback: onLogCallback) => void;
}

export { createQueue, Queue, queue, onErrorCallback, onLogCallback, LogType, registered };
