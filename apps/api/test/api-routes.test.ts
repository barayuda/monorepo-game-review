import { afterEach, describe, expect, it } from 'vitest'
import { ZodError } from 'zod'

import { buildApp } from '../src/app.js'
import { ApplicationNotFoundError } from '../src/shared/application-not-found-error.js'
import { ApplicationValidationError } from '../src/shared/application-validation-error.js'

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
		const games = response.json()
		expect(games).toHaveLength(19)
		expect(new Set(games.map((game: { id: string }) => game.id)).size).toBe(19)
		expect(games[0]).toEqual({
			id: 'astro-bot',
			title: 'Astro Bot',
			description:
				'Platformer 3D yang memperkenalkan satu ide baru di hampir setiap level lalu pensiun sebelum bosan.',
			genre: 'Platformer',
			platform: 'PlayStation 5',
			developer: 'Team Asobi',
			releaseYear: 2024,
			awardYear: 2024,
			awardRank: 1,
			imageUrl:
				'https://upload.wikimedia.org/wikipedia/en/a/a9/Astro_Bot_cover_art.jpg',
		})
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
			description: 'Menjelajahi Lands Between dalam action RPG dunia terbuka.',
			genre: 'Action RPG',
			platform: 'PlayStation 5',
			developer: 'FromSoftware',
			releaseYear: 2022,
			awardYear: 2022,
			awardRank: 1,
			imageUrl:
				'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg',
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

	it.each([
		['rating at the lower bound', { rating: 1 }],
		['rating at the upper bound', { rating: 5 }],
		['reviewerName at exactly 80 characters', { reviewerName: 'a'.repeat(80) }],
		['text at exactly 2000 characters', { text: 'b'.repeat(2000) }],
		[
			'reviewerName that trims down to exactly 80 characters',
			{ reviewerName: `  ${'a'.repeat(80)}  ` },
		],
	])('accepts %s', async (_label, overrides) => {
		// Hanya sisi penolakan yang diuji di lapisan HTTP; tanpa ini, memperketat
		// schema Zod route (misalnya max 79) tidak akan membuat satu test pun gagal.
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload: {
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: 4,
				...overrides,
			},
		})

		expect(response.statusCode).toBe(201)
	})

	it.each([
		['a missing field', { text: 'A memorable adventure.', rating: 4 }],
		[
			'a rating sent as a string',
			{
				reviewerName: 'Alex Morgan',
				text: 'A memorable adventure.',
				rating: '4',
			},
		],
	])('rejects %s', async (_label, payload) => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			payload,
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toMatchObject({ code: 'VALIDATION_ERROR' })
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

	it('reports a non-game missing resource as generic not-found', async () => {
		// Menangkap regresi ketika resource selain game dilaporkan sebagai GAME_NOT_FOUND.
		const app = buildApp()
		appsToClose.push(app)
		app.get('/test-only/missing-review', () => {
			throw new ApplicationNotFoundError('Review', 'review-404')
		})

		const response = await app.inject({
			method: 'GET',
			url: '/test-only/missing-review',
		})

		expect(response.statusCode).toBe(404)
		expect(response.json()).toEqual({
			code: 'NOT_FOUND',
			message: 'Review not found',
		})
	})

	it('maps a service-level invariant failure to the validation envelope', async () => {
		// Zod menolak payload HTTP lebih dulu, jadi invariant service hanya tercapai
		// dari caller non-HTTP. Pemetaannya tetap harus benar ketika itu terjadi.
		const app = buildApp()
		appsToClose.push(app)
		app.get('/test-only/invalid-invariant', () => {
			throw new ApplicationValidationError('rating', 'rating must be 1 to 5')
		})

		const response = await app.inject({
			method: 'GET',
			url: '/test-only/invalid-invariant',
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toEqual({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			issues: [{ path: ['rating'], message: 'rating must be 1 to 5' }],
		})
	})

	it('preserves array indices in a validation issue path', async () => {
		// Schema saat ini datar, jadi path selalu string. Cabang indeks numerik tetap
		// diuji supaya penambahan field array kelak tidak diam-diam merusak path issue.
		const app = buildApp()
		appsToClose.push(app)
		app.get('/test-only/array-issue', () => {
			throw new ZodError([
				{
					code: 'custom',
					path: ['tags', 0],
					message: 'tag pertama tidak valid',
				},
			])
		})

		const response = await app.inject({
			method: 'GET',
			url: '/test-only/array-issue',
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toEqual({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
			issues: [{ path: ['tags', 0], message: 'tag pertama tidak valid' }],
		})
	})

	it('returns an application health status', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({ method: 'GET', url: '/health' })

		expect(response.statusCode).toBe(200)
		expect(response.json()).toEqual({ status: 'ok' })
	})

	it('returns the public envelope for an unmatched path', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'GET',
			url: '/api/unknown-path',
		})

		expect(response.statusCode).toBe(404)
		expect(response.json()).toEqual({
			code: 'NOT_FOUND',
			message: 'Route not found',
		})
	})

	it('maps malformed JSON to the public validation error', async () => {
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			headers: { 'content-type': 'application/json' },
			payload: '{"reviewerName":',
		})

		expect(response.statusCode).toBe(400)
		expect(response.json()).toEqual({
			code: 'VALIDATION_ERROR',
			message: 'Validation failed',
		})
	})

	it('keeps an unsupported media type at its own status and code', async () => {
		// Menangkap regresi ketika 415 dilaporkan sebagai kegagalan validasi field,
		// atau lebih buruk lagi jatuh ke 500 karena tidak dikenali.
		const app = buildApp()
		appsToClose.push(app)

		const response = await app.inject({
			method: 'POST',
			url: '/api/games/elden-ring/reviews',
			headers: { 'content-type': 'application/xml' },
			payload: '<review/>',
		})

		expect(response.statusCode).toBe(415)
		expect(response.json()).toEqual({
			code: 'BAD_REQUEST',
			message: 'Request could not be processed',
		})
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
