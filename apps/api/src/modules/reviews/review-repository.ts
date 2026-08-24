import type { Review } from './review.js'

export interface ReviewRepository {
	findByGameId(gameId: string): Review[]
	create(review: Review): Review
}
