import { createQueue } from './Queue';
import { Connection } from './Queueable';
import { Generator } from './Commands/Generator';
import { Job } from './Resources/Job'
import { LogType } from './Queue'
import { onErrorCallback } from './Queue'
import { onLogCallback } from './Queue'
import { onReadyCallback } from './Queue'
import { Queue } from './Queue'
import { queue } from './Queue';
import { Queueable } from './Queueable';
import { QueueAbout } from './Commands/QueueAbout';
import { QueueFlush } from './Commands/QueueFlush';
import { QueueRetry } from './Commands/QueueRetry';
import { QueueServiceResolver } from './QueueServiceResolver';
import { QueueWork } from './Commands/QueueWork';
import { registered } from './Queue';

declare module '@formidablejs/framework' {
    export class ConsoleKernel {
        /**
         * A list of registered jobs.
         */
        get jobs(): Array<typeof Queueable>
    }
}

export {
    createQueue,
    Connection,
    Generator,
    Job,
    LogType,
    onErrorCallback,
    onLogCallback,
    onReadyCallback,
    Queue,
    queue,
    Queueable,
    QueueAbout,
    QueueFlush,
    QueueRetry,
    QueueServiceResolver,
    QueueWork,
    registered,
}
