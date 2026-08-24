import { describe, expect, it } from 'vitest'

import { gameQueries } from '../src/queries/game-queries.js'
import { reviewQueries } from '../src/queries/review-queries.js'

describe('query options', () => {
	it('menempatkan daftar game pada key cache katalog yang stabil', () => {
		expect(gameQueries.list().queryKey).toEqual(['games', 'list'])
	})

	it('memperbarui ulasan aktif setiap dua detik tanpa polling background', () => {
		// Menangkap regresi interval yang terlalu lambat atau aktivitas yang terus berjalan di background.
		const options = reviewQueries.byGameId('game-1')

		expect(options.queryKey).toEqual(['reviews', 'by-game', 'game-1'])
		expect(options.refetchInterval).toBe(2_000)
		expect(options.refetchIntervalInBackground).toBe(false)
	})
})
