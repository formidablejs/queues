import { Redis } from '@formidablejs/framework'
import { Application } from './app'
import { queue, registered } from "../src"
import { LogMessage } from './app/Jobs/LogMessage'

describe('src/Queue', () => {
    beforeAll(async () => {
        await Application
    })

    afterAll(async () => {
        await queue('default').close(30 * 1000)

        const connection = await Redis.connection('queue')

        await connection.disconnect()
    })

    it('should create a queue', async () => {
        expect(registered()).toContain('default')
    })
})
