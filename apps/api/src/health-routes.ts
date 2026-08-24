import type { HealthDto } from '@game-review/contracts'
import type { FastifyPluginAsync } from 'fastify'

/**
 * Menyediakan endpoint liveness mandiri agar pemeriksa infrastruktur tidak
 * perlu membaca atau mengubah state domain aplikasi.
 */
export const healthRoutes: FastifyPluginAsync = async (app) => {
	app.get('/health', () => ({ status: 'ok' }) satisfies HealthDto)
}
