import type { ReviewDto } from '@game-review/contracts'

import type { Review } from './review.js'

/**
 * Menyalin field publik sebuah ulasan satu per satu ke DTO, dengan alasan yang
 * sama seperti pada game: hanya field yang disebut di sini yang bisa sampai ke
 * client, apa pun yang kelak ditambahkan ke model domain.
 */
export const toReviewDto = (review: Review): ReviewDto => ({
	id: review.id,
	gameId: review.gameId,
	reviewerName: review.reviewerName,
	text: review.text,
	rating: review.rating,
	createdAt: review.createdAt,
})
