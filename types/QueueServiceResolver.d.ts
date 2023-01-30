import { ServiceResolver } from '@formidablejs/framework';
export declare class QueueServiceResolver extends ServiceResolver {
    /**
     * Boot up the queue service resolver.
     */
    boot(): void;
    /**
     * Register queue related commands.
     */
    register(): void;
}
