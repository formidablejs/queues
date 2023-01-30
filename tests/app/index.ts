import { Kernel } from '@formidablejs/framework'
import { app } from './app'

const Application = app.initiate(app.make(Kernel), true)

export { Application }
