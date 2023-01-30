import { Application } from '@formidablejs/framework'
import { resolve } from 'path'
import { ConfigRepository } from '@formidablejs/framework'
import { ExceptionHandler } from '@formidablejs/framework'
import { ConsoleKernel } from '@formidablejs/framework'
import { Kernel as HttpKernel } from '@formidablejs/framework'
import { Config } from './config'
import { Handler } from './exceptions/Handler'
import { Kernel } from './http/Kernel'
import { Kernel as AppConsole } from './http/Kernel'

let app = new Application(resolve('./'))

app
	.bind(ConfigRepository, Config)
	.bind(HttpKernel, Kernel)
	.bind(ConsoleKernel, AppConsole)
	.bind(ExceptionHandler, Handler)
	.prepare()

export { app }
