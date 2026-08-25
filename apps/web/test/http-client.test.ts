import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiClientError, httpClient } from '../src/api/http-client.js'

describe('httpClient', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('mengembalikan JSON dari respons API yang berhasil', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				new Response(JSON.stringify({ id: 'game-1', title: 'Bumi' }), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
			),
		)

		await expect(
			httpClient.get<{ id: string; title: string }>('/api/games/game-1'),
		).resolves.toEqual({
			id: 'game-1',
			title: 'Bumi',
		})
	})

	it('menerjemahkan envelope kesalahan API menjadi error terstruktur', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						code: 'GAME_NOT_FOUND',
						message: 'Game dengan id game-404 tidak ditemukan.',
					}),
					{ status: 404, headers: { 'content-type': 'application/json' } },
				),
			),
		)

		const request = httpClient.get('/api/games/game-404')

		await expect(request).rejects.toMatchObject({
			name: 'ApiClientError',
			status: 404,
			code: 'GAME_NOT_FOUND',
			message: 'Game dengan id game-404 tidak ditemukan.',
		})
		await expect(request).rejects.toBeInstanceOf(ApiClientError)
	})

	it('memberi pesan yang bisa dibaca ketika server membalas bukan JSON', async () => {
		// Menangkap regresi ketika 502 dari proxy membocorkan galat parsing mentah ke pengguna.
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				new Response('<html><body>502 Bad Gateway</body></html>', {
					status: 502,
					headers: { 'content-type': 'text/html' },
				}),
			),
		)

		await expect(httpClient.get('/api/games')).rejects.toMatchObject({
			name: 'ApiClientError',
			status: 502,
			code: 'UNKNOWN_ERROR',
			message: 'Permintaan ke server gagal.',
		})
	})
})
