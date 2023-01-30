import { Command } from '@formidablejs/framework';
export declare class QueueAbout extends Command {
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
     * Print information.
     */
    print(key: string, value: string): void;
    /**
     * Handle command.
     */
    handle(): Promise<void>;
}
