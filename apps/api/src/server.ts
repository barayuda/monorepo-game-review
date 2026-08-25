import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { buildApp } from './app.js'

/**
 * Memvalidasi konfigurasi transport sekali saat start.
 *
 * `Number('')` bernilai 0, yang membuat Node mengikat port ephemeral acak. Tanpa
 * pemeriksaan ini, `PORT` kosong atau salah ketik akan membuat container hidup
 * di port yang keliru dan hanya terlihat lewat healthcheck yang gagal.
 */
const serverEnvSchema = z.object({
	PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
})

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
		port: options.port ?? serverEnvSchema.parse(process.env).PORT,
	})

	return app
}
