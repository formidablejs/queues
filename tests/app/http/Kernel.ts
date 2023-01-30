import { HasEncryptionKey } from '@formidablejs/framework'
import { Kernel as HttpKernel } from '@formidablejs/framework'

export class Kernel extends HttpKernel {
	get middleware() {
		return [
			HasEncryptionKey,
		]
    }

	get middlewareGroups() {
		return {
			jwt: [

			],

			session: [

			],
		}
    }

	get routeMiddleware() {
		return { }
    }
}
