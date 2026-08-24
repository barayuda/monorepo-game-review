import { seededReviews } from '../../seed/reviews.js'

import type { Review } from './review.js'
import type { ReviewRepository } from './review-repository.js'

export class InMemoryReviewRepository implements ReviewRepository {
	private readonly reviews: Review[]

	constructor(reviews: readonly Review[] = seededReviews) {
		this.reviews = reviews.map((review) => ({ ...review }))
	}

	findByGameId(gameId: string): Review[] {
		return this.reviews
			.filter((review) => review.gameId === gameId)
			.map((review) => ({ ...review }))
	}

	create(review: Review): Review {
		const storedReview = { ...review }

		this.reviews.push(storedReview)

		return { ...storedReview }
	}
}
