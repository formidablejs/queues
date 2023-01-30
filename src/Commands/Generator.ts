import { Prop } from '@formidablejs/framework'
import { MakeResourceCommand } from '@formidablejs/framework/lib/Foundation/Console/Commands/MakeResourceCommand'
import { Job } from '../Resource/Job'

export class Generator extends MakeResourceCommand {
    /**
     * @inheritdoc
     */
    get signature(): string {
        return 'make:job {name} {?--queue} {?--domain}'
    }

    /**
     * @inheritdoc
     */
    get description(): string {
        return 'Create a new Job'
    }

    /**
     * @inheritdoc
     */
    get props(): object {
        return {
            name: Prop.string().description('The name of the job'),
            queue: Prop.string().nullable().description('The queue to run the job on'),
            domain: Prop.string().nullable().description('Domain name')
        }
    }

    /**
     * @inheritdoc
     */
    get resource(): string {
        return 'Job'
    }

    /**
     * @inheritdoc
     */
    get stub(): Job {
        return new Job(this.argument('name'), {
            queue: this.option('queue', null),
            domain: this.option('domain', null)
        }, 'stub', this.language.toLowerCase())
    }
}