import { MakeResourceCommand } from '@formidablejs/framework/lib/Foundation/Console/Commands/MakeResourceCommand';
import { Job } from '../Resource/Job';
export declare class Generator extends MakeResourceCommand {
    /**
     * @inheritdoc
     */
    get signature(): string;
    /**
     * @inheritdoc
     */
    get description(): string;
    /**
     * @inheritdoc
     */
    get props(): object;
    /**
     * @inheritdoc
     */
    get resource(): string;
    /**
     * @inheritdoc
     */
    get stub(): Job;
}
