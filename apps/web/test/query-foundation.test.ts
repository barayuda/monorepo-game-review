import { describe, expect, it } from 'vitest'

import { ApiClientError } from '../src/api/http-client.js'
import {
	createAppQueryClient,
	shouldRetryQuery,
} from '../src/queries/query-client.js'
import { gameQueryKeys, reviewQueryKeys } from '../src/queries/query-keys.js'

describe('query foundation', () => {
	it('membuat key cache stabil untuk detail game dan ulasannya', () => {
		expect(gameQueryKeys.detail('game-1')).toEqual([
			'games',
			'detail',
			'game-1',
		])
		expect(reviewQueryKeys.byGameId('game-1')).toEqual([
			'reviews',
			'by-game',
			'game-1',
		])
	})

	it('tetap mengulang kegagalan server 5xx yang mungkin sementara', () => {
		// 4xx adalah jawaban akhir; 5xx sering hanya blip dan layak dicoba ulang.
		expect(
			shouldRetryQuery(
				0,
				new ApiClientError('Internal', 500, 'INTERNAL_ERROR'),
			),
		).toBe(true)
	})

	it('tidak mengulang query ketika API sudah mengembalikan kesalahan 4xx', () => {
		expect(
			shouldRetryQuery(
				0,
				new ApiClientError('Game not found', 404, 'GAME_NOT_FOUND'),
			),
		).toBe(false)
	})

	it('membatasi retry kegagalan non-4xx dan memakai stale time yang konservatif', () => {
		const client = createAppQueryClient()
		const defaults = client.getDefaultOptions().queries

		if (!defaults) {
			throw new Error('Expected the app query client to define query defaults')
		}

		expect(shouldRetryQuery(0, new Error('network unavailable'))).toBe(true)
		expect(shouldRetryQuery(2, new Error('network unavailable'))).toBe(false)
		expect(defaults.staleTime).toBe(30_000)
		expect(defaults.refetchOnWindowFocus).toBe(false)
	})
})
