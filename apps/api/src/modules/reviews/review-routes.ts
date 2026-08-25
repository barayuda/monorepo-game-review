import type { CreateReviewRequestDto, ReviewDto } from '@game-review/contracts'
import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'

import { toReviewDto } from './review-mapper.js'
import type { ReviewService } from './review-service.js'

/**
 * Menjaga kontrak payload HTTP tetap selaras dengan invariant service agar
 * caller menerima kesalahan request terstruktur sebelum use case dijalankan.
 */
const createReviewRequestSchema = z.object({
	reviewerName: z.string().trim().min(1).max(80),
	text: z.string().trim().min(1).max(2000),
	rating: z.number().int().min(1).max(5),
})

/**
 * Mendaftarkan endpoint HTTP ulasan dan mendelegasikan aturan keberadaan game
 * serta pengurutan kepada service, bukan kepada handler transport.
 */
export const reviewRoutes = (
	reviewService: ReviewService,
): FastifyPluginAsync => {
	return async (app) => {
		app.get<{ Params: { gameId: string } }>(
			'/api/games/:gameId/reviews',
			(request): ReviewDto[] =>
				reviewService.listReviews(request.params.gameId).map(toReviewDto),
		)

		app.post<{ Params: { gameId: string }; Body: unknown }>(
			'/api/games/:gameId/reviews',
			(request, reply) => {
				const input = createReviewRequestSchema.parse(request.body)
				const review = reviewService.createReview(
					request.params.gameId,
					input satisfies CreateReviewRequestDto,
				)

				return reply.status(201).send(toReviewDto(review))
			},
		)
	}
}
