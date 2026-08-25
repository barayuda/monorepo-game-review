import { describe, expect, it } from 'vitest'

import { gameQueries } from '../src/queries/game-queries.js'
import { reviewQueries } from '../src/queries/review-queries.js'

/** Membentuk objek query minimal yang cukup untuk menghitung jeda polling. */
function queryWithFailures(fetchFailureCount: number) {
	return { state: { fetchFailureCount } } as Parameters<
		Extract<
			ReturnType<typeof reviewQueries.byGameId>['refetchInterval'],
			(...args: never[]) => unknown
		>
	>[0]
}

describe('query options', () => {
	it('menempatkan daftar game pada key cache katalog yang stabil', () => {
		expect(gameQueries.list().queryKey).toEqual(['games', 'list'])
	})

	it('mengisolasi cache ulasan berdasarkan identitas game', () => {
		expect(reviewQueries.byGameId('game-1').queryKey).toEqual([
			'reviews',
			'by-game',
			'game-1',
		])
	})

	it('tidak melanjutkan polling saat tab tidak aktif', () => {
		// Menangkap regresi ketika tab background ikut menembak API tanpa ada yang melihat.
		expect(reviewQueries.byGameId('game-1').refetchIntervalInBackground).toBe(
			false,
		)
	})

	it('memperbarui ulasan tiap dua detik selama permintaan berhasil', () => {
		const { refetchInterval } = reviewQueries.byGameId('game-1')

		expect(typeof refetchInterval).toBe('function')
		if (typeof refetchInterval !== 'function') {
			throw new Error('Expected refetchInterval to be computed per attempt')
		}

		expect(refetchInterval(queryWithFailures(0))).toBe(2_000)
	})

	it.each([
		[1, 4_000],
		[3, 16_000],
		[10, 30_000],
	])(
		'mundur teratur setelah %s kegagalan berturut-turut menjadi %s ms',
		(failures, expected) => {
			// Menangkap regresi ketika satu tab terbuka terus menembak API yang sedang mati tiap dua detik.
			const { refetchInterval } = reviewQueries.byGameId('game-1')
			if (typeof refetchInterval !== 'function') {
				throw new Error('Expected refetchInterval to be computed per attempt')
			}

			expect(refetchInterval(queryWithFailures(failures))).toBe(expected)
		},
	)
})
