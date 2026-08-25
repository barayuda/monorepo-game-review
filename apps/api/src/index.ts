import { startServer } from './server.js'

const app = await startServer()

/**
 * Menutup koneksi yang masih berjalan sebelum proses berhenti, sehingga
 * `docker compose down` tidak perlu menunggu timeout lalu mengirim SIGKILL.
 */
const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
	app.log.info({ signal }, 'shutting down')
	await app.close()
	process.exit(0)
}

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
	process.once(signal, () => void shutdown(signal))
}
