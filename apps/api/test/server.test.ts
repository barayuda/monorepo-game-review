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
})
