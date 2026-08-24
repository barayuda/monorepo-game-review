import type { FastifyInstance } from 'fastify'

import { buildApp } from './app.js'

/** Opsi transport untuk menjalankan API tanpa mencampurkan detail socket ke domain. */
export interface StartServerOptions {
	host?: string
	port?: number
}

/**
 * Menjalankan aplikasi Fastify pada seluruh interface secara default agar dapat
 * dijangkau antar-container, sambil tetap mengizinkan port ephemeral pada test.
 */
export const startServer = async (
	options: StartServerOptions = {},
): Promise<FastifyInstance> => {
	const app = buildApp()

	await app.listen({
		host: options.host ?? '0.0.0.0',
		port: options.port ?? Number(process.env.PORT ?? 3000),
	})

	return app
}
