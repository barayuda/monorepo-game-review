import { afterEach, describe, expect, it, vi } from 'vitest'

const close = vi.fn(async () => undefined)
const info = vi.fn()
const startServer = vi.fn(async () => ({ close, log: { info } }))

vi.mock('../src/server.js', () => ({ startServer }))

describe('API process entrypoint', () => {
	afterEach(() => {
		process.removeAllListeners('SIGTERM')
		process.removeAllListeners('SIGINT')
		vi.resetModules()
	})

	it('drains connections on SIGTERM instead of being killed', async () => {
		// Node berjalan sebagai PID 1 di container, sehingga tanpa handler ini SIGTERM
		// diabaikan dan `docker compose down` harus menunggu timeout lalu SIGKILL.
		const exit = vi
			.spyOn(process, 'exit')
			.mockImplementation((() => undefined) as never)

		await import('../src/index.js')

		expect(startServer).toHaveBeenCalledTimes(1)
		expect(process.listenerCount('SIGTERM')).toBe(1)
		expect(process.listenerCount('SIGINT')).toBe(1)

		process.emit('SIGTERM')
		await vi.waitFor(() => {
			expect(close).toHaveBeenCalledTimes(1)
		})

		expect(info).toHaveBeenCalledWith({ signal: 'SIGTERM' }, 'shutting down')
		expect(exit).toHaveBeenCalledWith(0)
	})
})
