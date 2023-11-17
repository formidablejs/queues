import { config } from '@formidablejs/framework'
import type { Connection } from '../../types/Common/Connection'

export const connection = (): Connection => config(`queue.connections.${config('queue.default')}`)
