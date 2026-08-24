import { describe, expect, it } from 'vitest'

import { gameQueries } from '../src/queries/game-queries.js'
import { reviewQueries } from '../src/queries/review-queries.js'

describe('query options', () => {
	it('menempatkan daftar game pada key cache katalog yang stabil', () => {
		expect(gameQueries.list().queryKey).toEqual(['games', 'list'])
	})

	it('membatasi polling ulasan pada detail game yang sedang terbuka', () => {
		const options = reviewQueries.byGameId('game-1')

		expect(options.queryKey).toEqual(['reviews', 'by-game', 'game-1'])
		expect(options.refetchInterval).toBe(2_000)
		expect(options.refetchIntervalInBackground).toBe(false)
	})
})
