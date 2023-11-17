// @ts-nocheck

import { Redis } from '@formidablejs/framework'
import { Application } from './app'
import { queue } from "../src"
import { LogMessage } from './app/LogMessage'
import { SayHello } from './app/SayHello'
import { JobExecutionTimeoutException } from '../src/Errors/JobExecutionTimeoutException'

describe('src/Queue', () => {
    beforeAll(async () => {
        await Application

        const jobs = await queue('default').getJobs('waiting', { start: 0 })

        const all = []

        for (let index = 0; index < jobs.length; index++) {
			const job = jobs[index];

			all.push(job.remove())
		}

        await Promise.all(all)
    })

    afterAll(async () => {
        await queue('default').close(30 * 1000)

        const connection = await Redis.connection('queue')

        await connection.disconnect()
    })

    it('should queue a job', async () => {
        await LogMessage.dispatch()

        const health = await queue('default').checkHealth()

        expect(health.waiting).toBe(1)
    })

    it('should queue a delayed job', async () => {
        const job = await LogMessage.delay('1 minute').dispatch()

        expect(job.options.delay).toBeDefined()
    })

    it('should queue a sync job', async () => {
        const log = jest.spyOn(global.console, 'log').mockImplementation(() => { });
        const job = await SayHello.dispatch('Donald')

        expect(log).toHaveBeenCalledWith('Hello Donald')
        expect(job).toBeUndefined()

        log.mockRestore();
    })

    it('should queue a sync delayed job', async () => {
        const log = jest.spyOn(global.console, 'log').mockImplementation(() => { });
        const job = await SayHello.delay('10 seconds').dispatch()

        expect(log).toHaveBeenCalledWith('this logs a message...')
        expect(job).toBeUndefined()

        log.mockRestore();
    })
})
