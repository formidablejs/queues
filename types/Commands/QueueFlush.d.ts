import { Command } from '@formidablejs/framework';
export declare class QueueFlush extends Command {
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
    handle(): Promise<void>;
}
