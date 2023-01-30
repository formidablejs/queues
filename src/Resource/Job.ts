import { Stub } from '@formidablejs/stubs'
import { join } from 'path'

export class Job extends Stub {
    /**
	 * @inheritdoc
	 */
    get props(): object {
        return {
            queue: {
                type: String,
                required: false
            },
            domain: {
				type: String,
				required: false
			}
        }
    }

    /**
     * @inheritdoc
     */
    get data(): object {
        return {
            'class': this.realClassName,
            'queue': this.options.queue
        }
    }

    /**
     * @inheritdoc
     */
    get stub(): string  {
        const ext = this.language == 'imba'
            ? '.imba' : (
                this.language == 'typescript' ? '.ts' : '.imba'
            )

        let stub = 'stub'

        if (this.options.queue) {
            stub = 'stub-queue'
        }

        return join(__dirname, '..', '..', 'formidable', 'stubs', (stub + ext))
    }

    /**
	 * @inheritdoc
	 */
    get destination(): string {
        if (this.options.domain) {
            return `app/Domain/${this.options.domain}/Jobs`
        }

        return 'app/Jobs'
    }
}