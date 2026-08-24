import { ApplicationValidationError } from '../../shared/application-validation-error.js'

import type { GameService } from '../games/game-service.js'

import type { ReviewRepository } from './review-repository.js'
import type { CreateReviewInput, Review } from './review.js'

/**
 * Menjalankan use case ulasan: memastikan game ada, menjaga invariant data,
 * lalu menyerahkan persistence kepada repository.
 */
export class ReviewService {
	/**
	 * Dependency dipisahkan agar keberadaan game, penyimpanan ulasan, id, dan
	 * waktu dapat diganti atau dikendalikan tanpa mengubah aturan use case.
	 */
	constructor(
		private readonly gameService: GameService,
		private readonly reviewRepository: ReviewRepository,
		private readonly createId: () => string = () => crypto.randomUUID(),
		private readonly now: () => Date = () => new Date(),
	) {}

	/**
	 * Mengambil ulasan sebuah game dalam urutan terbaru lebih dahulu.
	 *
	 * @throws {ApplicationNotFoundError} Bila game tidak ada.
	 */
	listReviews(gameId: string): Review[] {
		this.gameService.getGameById(gameId)

		return this.reviewRepository
			.findByGameId(gameId)
			.sort((left, right) => right.createdAt.localeCompare(left.createdAt))
	}

	/**
	 * Membuat ulasan setelah menormalisasi teks dan memeriksa invariant domain.
	 * Validasi tetap berada di service meski HTTP memakai Zod, karena use case
	 * ini juga dapat dipanggil dari transport lain.
	 *
	 * @throws {ApplicationNotFoundError} Bila game tujuan tidak ada.
	 * @throws {ApplicationValidationError} Bila nama, teks, atau rating tidak valid.
	 */
	createReview(gameId: string, input: CreateReviewInput): Review {
		this.gameService.getGameById(gameId)
		const reviewerName = input.reviewerName.trim()
		const text = input.text.trim()

		if (reviewerName.length < 1 || reviewerName.length > 80) {
			throw new ApplicationValidationError(
				'reviewerName',
				'reviewerName must be between 1 and 80 characters',
			)
		}

		if (text.length < 1 || text.length > 2000) {
			throw new ApplicationValidationError(
				'text',
				'text must be between 1 and 2000 characters',
			)
		}

		if (
			!Number.isInteger(input.rating) ||
			input.rating < 1 ||
			input.rating > 5
		) {
			throw new ApplicationValidationError(
				'rating',
				'rating must be an integer between 1 and 5',
			)
		}

		return this.reviewRepository.create({
			id: this.createId(),
			gameId,
			reviewerName,
			text,
			rating: input.rating,
			createdAt: this.now().toISOString(),
		})
	}
}
