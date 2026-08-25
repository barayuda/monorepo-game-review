import Fastify from 'fastify'
import type { ApiErrorDto } from '@game-review/contracts'
import { ZodError } from 'zod'

import { GameService } from './modules/games/game-service.js'
import { InMemoryGameRepository } from './modules/games/in-memory-game-repository.js'
import { gameRoutes } from './modules/games/game-routes.js'
import { InMemoryReviewRepository } from './modules/reviews/in-memory-review-repository.js'
import { reviewRoutes } from './modules/reviews/review-routes.js'
import { ReviewService } from './modules/reviews/review-service.js'
import { ApplicationNotFoundError } from './shared/application-not-found-error.js'
import { ApplicationValidationError } from './shared/application-validation-error.js'
import { healthRoutes } from './health-routes.js'

/**
 * Override kecil untuk membuat hasil route deterministik pada test tanpa
 * membocorkan container dependency aplikasi sebagai API publik.
 */
export interface BuildAppOptions {
	createReviewId?: () => string
	now?: () => Date
}

/**
 * Membatasi respons path yang tidak terdaftar pada kontrak publik tanpa
 * membocorkan method maupun URL internal Fastify.
 */
const routeNotFoundError: ApiErrorDto = {
	code: 'NOT_FOUND',
	message: 'Route not found',
}

/**
 * Mengenali error parser dan content Fastify yang menandakan request client
 * tidak dapat diproses, tanpa mengandalkan pesan internal framework.
 */
const isFastifyClientRequestError = (
	error: unknown,
): error is Error & { statusCode: number } => {
	return (
		error instanceof Error &&
		'statusCode' in error &&
		typeof error.statusCode === 'number' &&
		error.statusCode >= 400 &&
		error.statusCode < 500
	)
}

/**
 * Menerjemahkan error aplikasi dan request ke kontrak HTTP tanpa mengekspos
 * pesan atau stack kegagalan internal kepada caller.
 */
const toHttpError = (
	error: unknown,
): { statusCode: number; body: ApiErrorDto } => {
	if (error instanceof ApplicationNotFoundError) {
		return {
			statusCode: 404,
			body: { code: 'GAME_NOT_FOUND', message: 'Game not found' },
		}
	}

	if (error instanceof ApplicationValidationError) {
		return {
			statusCode: 400,
			body: {
				code: 'VALIDATION_ERROR',
				message: 'Validation failed',
				issues: [{ path: [error.field], message: error.message }],
			},
		}
	}

	if (error instanceof ZodError) {
		return {
			statusCode: 400,
			body: {
				code: 'VALIDATION_ERROR',
				message: 'Validation failed',
				issues: error.issues.map((issue) => ({
					path: issue.path.map((segment) =>
						typeof segment === 'number' ? segment : String(segment),
					),
					message: issue.message,
				})),
			},
		}
	}

	if (isFastifyClientRequestError(error)) {
		return {
			statusCode: error.statusCode,
			body: { code: 'VALIDATION_ERROR', message: 'Validation failed' },
		}
	}

	return {
		statusCode: 500,
		body: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
	}
}

/**
 * Menyusun aplikasi Fastify baru dengan repository in-memory berisi seed baru
 * pada setiap pemanggilan, sehingga state satu aplikasi tidak bocor ke aplikasi lain.
 */
export const buildApp = (options: BuildAppOptions = {}) => {
	// Senyap saat test agar output suite bersih; selain itu request dan kegagalan wajib tercatat.
	const app = Fastify({ logger: process.env.NODE_ENV !== 'test' })
	const gameService = new GameService(new InMemoryGameRepository())
	const reviewService = new ReviewService(
		gameService,
		new InMemoryReviewRepository(),
		options.createReviewId,
		options.now,
	)

	app.setErrorHandler((error, request, reply) => {
		const mappedError = toHttpError(error)

		// Client hanya menerima envelope yang sudah disanitasi, jadi detail aslinya harus mendarat di log.
		if (mappedError.statusCode >= 500) {
			request.log.error({ err: error }, 'unhandled request error')
		} else {
			request.log.warn({ err: error }, 'rejected request')
		}

		return reply.status(mappedError.statusCode).send(mappedError.body)
	})

	app.setNotFoundHandler((_request, reply) =>
		reply.status(404).send(routeNotFoundError),
	)

	app.register(gameRoutes(gameService))
	app.register(reviewRoutes(reviewService))
	app.register(healthRoutes)

	return app
}
