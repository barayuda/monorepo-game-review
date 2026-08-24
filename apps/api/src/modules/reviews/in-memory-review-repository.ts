import { seededReviews } from '../../seed/reviews.js'

import type { Review } from './review.js'
import type { ReviewRepository } from './review-repository.js'

/**
 * Adapter persistence lokal untuk ulasan. Ia menyalin input dan output agar
 * mutasi dari caller tidak mengubah state in-memory secara tidak disengaja.
 */
export class InMemoryReviewRepository implements ReviewRepository {
	private readonly reviews: Review[]

	/** Menginisialisasi state dari seed atau data pengganti untuk komposisi aplikasi. */
	constructor(reviews: readonly Review[] = seededReviews) {
		this.reviews = reviews.map((review) => ({ ...review }))
	}

	/** Mengambil salinan semua ulasan untuk satu game tanpa menerapkan urutan use case. */
	findByGameId(gameId: string): Review[] {
		return this.reviews
			.filter((review) => review.gameId === gameId)
			.map((review) => ({ ...review }))
	}

	/** Menyimpan dan mengembalikan salinan ulasan agar referensi caller tetap terisolasi. */
	create(review: Review): Review {
		const storedReview = { ...review }

		this.reviews.push(storedReview)

		return { ...storedReview }
	}
}
