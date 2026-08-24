import { describe, expect, it } from 'vitest'

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

	it('tidak mengulang query ketika API sudah mengembalikan kesalahan 4xx', () => {
		expect(shouldRetryQuery(0, { status: 404 })).toBe(false)
	})

	it('membatasi retry kegagalan non-4xx dan memakai stale time yang konservatif', () => {
		const client = createAppQueryClient()
		const defaults = client.getDefaultOptions().queries

		expect(shouldRetryQuery(0, new Error('network unavailable'))).toBe(true)
		expect(shouldRetryQuery(2, new Error('network unavailable'))).toBe(false)
		expect(defaults.staleTime).toBe(30_000)
		expect(defaults.refetchOnWindowFocus).toBe(false)
	})
})
