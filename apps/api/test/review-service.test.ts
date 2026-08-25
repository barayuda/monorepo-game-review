import { describe, expect, it } from 'vitest'

import { GameService } from '../src/modules/games/game-service.js'
import { InMemoryGameRepository } from '../src/modules/games/in-memory-game-repository.js'
import { InMemoryReviewRepository } from '../src/modules/reviews/in-memory-review-repository.js'
import type { Review } from '../src/modules/reviews/review.js'
import { ReviewService } from '../src/modules/reviews/review-service.js'
import { ApplicationNotFoundError } from '../src/shared/application-not-found-error.js'
import { ApplicationValidationError } from '../src/shared/application-validation-error.js'

describe('ReviewService', () => {
	it("returns a game's reviews newest first", () => {
		const service = new ReviewService(
			new GameService(new InMemoryGameRepository()),
			new InMemoryReviewRepository(),
		)

		expect(service.listReviews('elden-ring')).toEqual([
			{
				id: 'review-elden-2',
				gameId: 'elden-ring',
				reviewerName: 'Samira Patel',
				text: 'Luas dan sulit, tapi rasa penasaran hampir selalu dibayar tuntas.',
				rating: 5,
				createdAt: '2025-01-20T09:30:00.000Z',
			},
			{
				id: 'review-elden-1',
				gameId: 'elden-ring',
				reviewerName: 'Jordan Lee',
				text: 'Desain dunianya membuat setiap belokan yang tidak direncanakan terasa berharga.',
				rating: 5,
				createdAt: '2025-01-15T14:00:00.000Z',
			},
		])
	})

	it('creates a trimmed review for an existing game', () => {
		const service = new ReviewService(
			new GameService(new InMemoryGameRepository()),
			new InMemoryReviewRepository(),
			() => 'review-new',
			() => new Date('2025-02-01T12:00:00.000Z'),
		)

		const createdReview = service.createReview('elden-ring', {
			reviewerName: '  Alex Morgan  ',
			text: '  A memorable adventure.  ',
			rating: 4,
		})

		expect(createdReview).toEqual({
			id: 'review-new',
			gameId: 'elden-ring',
			reviewerName: 'Alex Morgan',
			text: 'A memorable adventure.',
			rating: 4,
			createdAt: '2025-02-01T12:00:00.000Z',
		})
		expect(service.listReviews('elden-ring')[0]).toEqual(createdReview)
	})

	it.each([
		['a'.repeat(80), 'b'.repeat(2000), 1],
		['Alex Morgan', 'A memorable adventure.', 5],
	])(
		'accepts review input at inclusive domain boundaries',
		(reviewerName, text, rating) => {
			const service = new ReviewService(
				new GameService(new InMemoryGameRepository()),
				new InMemoryReviewRepository(),
				() => 'review-boundary',
				() => new Date('2025-02-01T12:00:00.000Z'),
			)

			expect(
				service.createReview('elden-ring', { reviewerName, text, rating }),
			).toMatchObject({ reviewerName, text, rating })
		},
	)

	it('trims review input before applying maximum lengths', () => {
		const reviewerName = 'a'.repeat(80)
		const text = 'b'.repeat(2000)
		const service = new ReviewService(
			new GameService(new InMemoryGameRepository()),
			new InMemoryReviewRepository(),
			() => 'review-trimmed-maximum',
			() => new Date('2025-02-01T12:00:00.000Z'),
		)

		expect(
			service.createReview('elden-ring', {
				reviewerName: `  ${reviewerName}  `,
				text: `  ${text}  `,
				rating: 5,
			}),
		).toMatchObject({ reviewerName, text, rating: 5 })
	})

	it("throws a typed not-found error when listing an unknown game's reviews", () => {
		const service = new ReviewService(
			new GameService(new InMemoryGameRepository()),
			new InMemoryReviewRepository(),
		)

		expect(() => service.listReviews('unknown-game')).toThrow(
			ApplicationNotFoundError,
		)
	})

	it('throws a typed not-found error when creating a review for an unknown game', () => {
		const service = new ReviewService(
			new GameService(new InMemoryGameRepository()),
			new InMemoryReviewRepository(),
		)

		expect(() =>
			service.createReview('unknown-game', {
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 4,
			}),
		).toThrow(ApplicationNotFoundError)
	})

	it.each([
		[
			{ reviewerName: ' ', text: 'A memorable adventure.', rating: 4 },
			'reviewerName',
		],
		[
			{
				reviewerName: 'a'.repeat(81),
				text: 'A memorable adventure.',
				rating: 4,
			},
			'reviewerName',
		],
		[{ reviewerName: 'Alex Morgan', text: ' ', rating: 4 }, 'text'],
		[
			{
				reviewerName: 'Alex Morgan',
				text: 'a'.repeat(2001),
				rating: 4,
			},
			'text',
		],
		[
			{
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 0,
			},
			'rating',
		],
		[
			{
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 6,
			},
			'rating',
		],
		[
			{
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 4.5,
			},
			'rating',
		],
	])('rejects invalid review input for %s', (input, field) => {
		const service = new ReviewService(
			new GameService(new InMemoryGameRepository()),
			new InMemoryReviewRepository(),
		)

		try {
			service.createReview('elden-ring', input)
		} catch (error) {
			expect(error).toBeInstanceOf(ApplicationValidationError)
			expect(error).toMatchObject({ code: 'VALIDATION_ERROR', field })
			return
		}

		expect.unreachable('Expected invalid review input to be rejected')
	})
})

describe('InMemoryReviewRepository', () => {
	it('does not retain mutable caller seed records', () => {
		const reviews: Review[] = [
			{
				id: 'review-elden-1',
				gameId: 'elden-ring',
				reviewerName: 'Jordan Lee',
				text: 'Worth exploring.',
				rating: 5,
				createdAt: '2025-01-15T14:00:00.000Z',
			},
		]
		const repository = new InMemoryReviewRepository(reviews)

		reviews[0].text = 'Changed by caller'

		expect(repository.findByGameId('elden-ring')[0]).toMatchObject({
			text: 'Worth exploring.',
		})
	})

	it('does not expose mutable records from reads or creation', () => {
		const repository = new InMemoryReviewRepository([
			{
				id: 'review-elden-1',
				gameId: 'elden-ring',
				reviewerName: 'Jordan Lee',
				text: 'Worth exploring.',
				rating: 5,
				createdAt: '2025-01-15T14:00:00.000Z',
			},
		])
		const listedReview = repository.findByGameId('elden-ring')[0]
		listedReview.text = 'Changed from list'
		const reviewToCreate: Review = {
			id: 'review-elden-2',
			gameId: 'elden-ring',
			reviewerName: 'Samira Patel',
			text: 'An excellent journey.',
			rating: 5,
			createdAt: '2025-01-20T09:30:00.000Z',
		}
		const createdReview = repository.create(reviewToCreate)
		reviewToCreate.text = 'Changed after create'
		createdReview.text = 'Changed from create result'

		expect(repository.findByGameId('elden-ring')).toEqual([
			{
				id: 'review-elden-1',
				gameId: 'elden-ring',
				reviewerName: 'Jordan Lee',
				text: 'Worth exploring.',
				rating: 5,
				createdAt: '2025-01-15T14:00:00.000Z',
			},
			{
				id: 'review-elden-2',
				gameId: 'elden-ring',
				reviewerName: 'Samira Patel',
				text: 'An excellent journey.',
				rating: 5,
				createdAt: '2025-01-20T09:30:00.000Z',
			},
		])
	})
})
