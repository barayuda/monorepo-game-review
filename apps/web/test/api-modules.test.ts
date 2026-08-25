import { afterEach, describe, expect, it, vi } from 'vitest'

import { gamesApi } from '../src/api/games.api.js'
import { reviewsApi } from '../src/api/reviews.api.js'

describe('API modules', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('memuat daftar game dari path API relatif', async () => {
		const fetchStub = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify([
					{
						id: 'game-1',
						title: 'Bumi',
						description: 'Petualangan antariksa.',
						genre: 'Adventure',
						platform: 'PC',
						developer: 'Studio Bumi',
						releaseYear: 2024,
					},
				]),
				{ status: 200, headers: { 'content-type': 'application/json' } },
			),
		)
		vi.stubGlobal('fetch', fetchStub)

		await expect(gamesApi.list()).resolves.toMatchObject([
			{ id: 'game-1', title: 'Bumi' },
		])
		expect(fetchStub.mock.calls[0]?.[0]).toBe('/api/games')
	})

	it('mengirim payload ulasan ke game yang dipilih', async () => {
		const fetchStub = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					id: 'review-1',
					gameId: 'game-1',
					reviewerName: 'Ayu',
					text: 'Sangat seru!',
					rating: 5,
					createdAt: '2026-08-24T00:00:00.000Z',
				}),
				{ status: 201, headers: { 'content-type': 'application/json' } },
			),
		)
		vi.stubGlobal('fetch', fetchStub)

		await expect(
			reviewsApi.create('game-1', {
				reviewerName: 'Ayu',
				text: 'Sangat seru!',
				rating: 5,
			}),
		).resolves.toMatchObject({ id: 'review-1', gameId: 'game-1' })
		expect(fetchStub).toHaveBeenCalledWith('/api/games/game-1/reviews', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				reviewerName: 'Ayu',
				text: 'Sangat seru!',
				rating: 5,
			}),
		})
	})
})
