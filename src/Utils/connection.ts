import { config } from '@formidablejs/framework'
import { InvalidQueueConfigurationException } from '..'
import type { Connection } from '../../types/Common/Connection'

export const connection = (queueName?: string): Connection => {
    if (queueName) {
        const connections = config('queue.connections')
        let current

        for (const connection in connections) {
            if (connections[connection].queue === queueName) {
                current = connections[connection]

                break;
            }
        }

        if (!current) {
            throw new InvalidQueueConfigurationException('Queue connection not found.')
        }

        return current
    }

    return config(`queue.connections.${config('queue.default')}`)
}
