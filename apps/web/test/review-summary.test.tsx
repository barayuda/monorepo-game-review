import type { ReviewDto } from '@game-review/contracts'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { RatingMeter } from '../src/components/rating-meter.js'
import { ReviewSummary } from '../src/components/review-summary.js'

function buildReviews(ratings: number[]): ReviewDto[] {
	return ratings.map((rating, index) => ({
		id: `review-${index}`,
		gameId: 'laut-senja',
		reviewerName: `Pemain ${index}`,
		text: 'Ulasan contoh.',
		rating,
		createdAt: `2026-08-2${index}T10:00:00.000Z`,
	}))
}

describe('ringkasan penilaian', () => {
	afterEach(() => {
		cleanup()
	})

	it('merata-ratakan rating dan menulis desimal dengan koma', () => {
		// Menangkap regresi ketika rata-rata salah hitung atau desimalnya berubah jadi titik gaya Inggris.
		render(<ReviewSummary reviews={buildReviews([5, 4])} />)

		expect(screen.getByText('4,5')).toBeTruthy()
		expect(screen.getByLabelText('Rata-rata rating 4,5 dari 5')).toBeTruthy()
	})

	it('tetap menampilkan satu desimal untuk rata-rata bulat', () => {
		// Menangkap regresi ketika nilai bulat kehilangan desimalnya dan tampil sebagai "3".
		render(<ReviewSummary reviews={buildReviews([3])} />)

		expect(screen.getByText('3,0')).toBeTruthy()
	})

	it('membulatkan rata-rata berulang ke satu desimal', () => {
		// 4,333... harus tampil 4,3 dan bukan deretan desimal panjang.
		render(<ReviewSummary reviews={buildReviews([5, 4, 4])} />)

		expect(screen.getByText('4,3')).toBeTruthy()
	})

	it('menyebut jumlah ulasan yang menjadi dasar rata-rata', () => {
		// Menangkap regresi ketika pembaca tidak tahu rata-rata dihitung dari berapa suara.
		render(<ReviewSummary reviews={buildReviews([4])} />)

		expect(screen.getByText('1 ulasan pemain')).toBeTruthy()
	})

	it('tidak menampilkan apa pun ketika belum ada ulasan', () => {
		// Menangkap regresi ketika game tanpa ulasan merender NaN sebagai rata-rata.
		const { container } = render(<ReviewSummary reviews={[]} />)

		expect(container.firstChild).toBeNull()
	})
})

describe('RatingMeter', () => {
	afterEach(() => {
		cleanup()
	})

	it('meneruskan nama aksesibel apa adanya dari pemanggil', () => {
		// Nama aksesibel adalah satu-satunya cara pembaca layar mengetahui nilainya.
		render(<RatingMeter label="Rating 3 dari 5" value={3} />)

		expect(screen.getByRole('img', { name: 'Rating 3 dari 5' })).toBeTruthy()
	})

	it.each([
		[4.5, 5],
		[4.4, 4],
	])(
		'membulatkan nilai %s menjadi %s segmen terisi',
		(value, expectedFilled) => {
			// Nilai pecahan hanya muncul lewat rata-rata, jadi pembulatannya perlu dikunci.
			const { container } = render(
				<RatingMeter
					label={`Rata-rata rating ${value} dari 5`}
					value={value}
				/>,
			)
			const filled = container.querySelectorAll('.bg-verdict\\/12')

			expect(filled).toHaveLength(expectedFilled)
		},
	)
})
