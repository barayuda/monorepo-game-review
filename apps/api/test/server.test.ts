import { afterEach, describe, expect, it } from 'vitest'

interface RunningApp {
	close: () => Promise<void>
}

const appsToClose: RunningApp[] = []

afterEach(async () => {
	await Promise.all(appsToClose.splice(0).map((app) => app.close()))
})

describe('API server', () => {
	it('listens on every interface and serves the application health route', async () => {
		const { startServer } = await import('../src/server.js')
		const app = await startServer({ port: 0 })
		appsToClose.push(app)
		const address = app.addresses()[0]

		expect(address?.address).toBe('0.0.0.0')

		const response = await fetch(
			`http://127.0.0.1:${address?.port ?? 0}/health`,
		)

		expect(response.status).toBe(200)
		expect(await response.json()).toEqual({ status: 'ok' })
	})

	it('refuses to start on a malformed PORT instead of binding a random one', async () => {
		// Number('') is 0, which binds an arbitrary ephemeral port. Failing loudly is
		// the only way a misconfigured container is distinguishable from a healthy one.
		const originalPort = process.env.PORT
		process.env.PORT = '   '

		try {
			const { startServer } = await import('../src/server.js')
			await expect(startServer()).rejects.toThrow()
		} finally {
			if (originalPort === undefined) {
				delete process.env.PORT
			} else {
				process.env.PORT = originalPort
			}
		}
	})
})
