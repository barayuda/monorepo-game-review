import { afterEach, describe, expect, it } from 'vitest'

import { buildApp } from '../src/app.js'

const appsToClose: Array<ReturnType<typeof buildApp>> = []

afterEach(async () => {
	await Promise.all(appsToClose.splice(0).map((app) => app.close()))
})

describe('API routes', () => {
	it('lists the seeded game catalogue', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({ method: 'GET', url: '/api/games' })

		expect(response.statusCode).toBe(200)
		expect(response.json()).toEqual([
			{
				id: 'elden-ring',
				title: 'Elden Ring',
				description:
					'Explore the Lands Between in an open-world action role-playing game.',
				genre: 'Action RPG',
				platform: 'PlayStation 5',
			},
			{
				id: 'hades',
				title: 'Hades',
				description:
					'Battle out of the underworld in this roguelike dungeon crawler.',
				genre: 'Roguelike',
				platform: 'Nintendo Switch',
			},
			{
				id: 'stardew-valley',
				title: 'Stardew Valley',
				description: 'Build a new life on a farm in a charming country town.',
				genre: 'Simulation',
				platform: 'PC',
			},
		])
	})

	it('returns a seeded game by id', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'GET',
			url: '/api/games/elden-ring',
		})

		expect(response.statusCode).toBe(200)
		expect(response.json()).toEqual({
			id: 'elden-ring',
			title: 'Elden Ring',
			description:
				'Explore the Lands Between in an open-world action role-playing game.',
			genre: 'Action RPG',
			platform: 'PlayStation 5',
		})
	})

	it('maps an unknown game to the public not-found error', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'GET',
			url: '/api/games/unknown-game',
		})

		expect(response.statusCode).toBe(404)
		expect(response.json()).toEqual({
			code: 'GAME_NOT_FOUND',
			message: 'Game not found',
		})
	})

	it("lists a game's reviews newest first", async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'GET',
			url: '/api/games/elden-ring/reviews',
		})

		expect(response.statusCode).toBe(200)
		expect(response.json()).toEqual([
			{
				id: 'review-elden-2',
				gameId: 'elden-ring',
				reviewerName: 'Samira Patel',
				text: 'A vast, challenging adventure that rewards curiosity.',
				rating: 5,
				createdAt: '2025-01-20T09:30:00.000Z',
			},
			{
				id: 'review-elden-1',
				gameId: 'elden-ring',
				reviewerName: 'Jordan Lee',
				text: 'Its world design makes every detour feel worthwhile.',
				rating: 5,
				createdAt: '2025-01-15T14:00:00.000Z',
			},
		])
	})

	it('maps an unknown review-list parent to the public not-found error', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'GET',
			url: '/api/games/unknown-game/reviews',
		})

		expect(response.statusCode).toBe(404)
		expect(response.json()).toEqual({
			code: 'GAME_NOT_FOUND',
			message: 'Game not found',
		})
	})

	it('creates a review and returns it in later reads', async () => {
		const app = buildApp({
			createReviewId: () => 'review-new',
			now: () => new Date('2025-02-01T12:00:00.000Z'),
		})
		appsToClose.push(app)

		const createResponse = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload: {
				reviewerName: '  Alex Morgan  ',
				text: '  A memorable adventure.  ',
				rating: 4,
			},
		})

		expect(createResponse.statusCode).toBe(201)
		expect(createResponse.json()).toEqual({
			id: 'review-new',
			gameId: 'elden-ring',
			reviewerName: 'Alex Morgan',
			text: 'A memorable adventure.',
			rating: 4,
			createdAt: '2025-02-01T12:00:00.000Z',
		})

		const listResponse = await app.inject({
			method: 'GET',
			url: '/api/games/elden-ring/reviews',
		})

		expect(listResponse.statusCode).toBe(200)
		expect(listResponse.json()[0]).toEqual(createResponse.json())
	})

	it('creates isolated seeded application state for every build', async () => {
		const appWithNewReview = buildApp({
			createReviewId: () => 'review-isolated',
			now: () => new Date('2025-02-01T12:00:00.000Z'),
		})
		const freshApp = buildApp()
		appsToClose.push(appWithNewReview, freshApp)

		const createResponse = await appWithNewReview.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload: {
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 4,
			},
		})
		const freshListResponse = await freshApp.inject({
			method: 'GET',
			url: '/api/games/elden-ring/reviews',
		})

		expect(createResponse.statusCode).toBe(201)
		expect(freshListResponse.statusCode).toBe(200)
		expect(freshListResponse.json()).not.toContainEqual(
			expect.objectContaining({ id: 'review-isolated' }),
		)
	})

	it('rejects a rating below one', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload: {
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 0,
			},
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toMatchObject({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			issues: [{ path: ['rating'], message: expect.any(String) }],
		})
	})

	it('rejects a rating above five', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload: {
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 6,
			},
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toMatchObject({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			issues: [{ path: ['rating'], message: expect.any(String) }],
		})
	})

	it('rejects a non-integer rating', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload: {
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 4.5,
			},
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toMatchObject({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			issues: [{ path: ['rating'], message: expect.any(String) }],
		})
	})

	it('rejects a blank reviewer name', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload: {
				reviewerName: '   ',
				text: 'A memorable adventure.',
				rating: 4,
			},
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toMatchObject({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			issues: [{ path: ['reviewerName'], message: expect.any(String) }],
		})
	})

	it('rejects blank review text', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload: {
				reviewerName: 'Alex Morgan',
				text: '   ',
				rating: 4,
			},
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toMatchObject({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			issues: [{ path: ['text'], message: expect.any(String) }],
		})
	})

	it.each([
		[
			'reviewerName',
			{
				reviewerName: 'a'.repeat(81),
				text: 'A memorable adventure.',
				rating: 4,
			},
		],
		[
			'text',
			{ reviewerName: 'Alex Morgan', text: 'a'.repeat(2001), rating: 4 },
		],
	])('rejects overlong %s with a validation error', async (field, payload) => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload,
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toMatchObject({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			issues: [{ path: [field], message: expect.any(String) }],
		})
	})

	it('maps an unknown review parent to the public not-found error', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/unknown-game/reviews',
			payload: {
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 4,
			},
		})

		expect(response.statusCode).toBe(404)
		expect(response.json()).toEqual({
			code: 'GAME_NOT_FOUND',
			message: 'Game not found',
		})
	})

	it('returns an application health status', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({ method: 'GET', url: '/health' })

		expect(response.statusCode).toBe(200)
		expect(response.json()).toEqual({ status: 'ok' })
	})

	it('does not leak unexpected failures through the HTTP error envelope', async () => {
		const app = buildApp()
		appsToClose.push(app)
		app.get('/test-only/unexpected-error', () => {
			throw new Error('database password leaked')
		})

		const response = await app.inject({
			method: 'GET',
			url: '/test-only/unexpected-error',
		})

		expect(response.statusCode).toBe(500)
		expect(response.json()).toEqual({
			code: 'INTERNAL_ERROR',
			message: 'Internal server error',
		})
	})
})
