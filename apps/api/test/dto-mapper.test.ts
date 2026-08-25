import { describe, expect, it } from 'vitest'

import { toGameDto } from '../src/modules/games/game-mapper.js'
import type { Game } from '../src/modules/games/game.js'
import { toReviewDto } from '../src/modules/reviews/review-mapper.js'
import type { Review } from '../src/modules/reviews/review.js'

/**
 * Field internal disimulasikan lewat cast karena tipe `Game` dan `Review` memang
 * belum memilikinya. Yang diuji adalah perilaku mapper saat model domain tumbuh.
 */
describe('DTO mappers', () => {
	it('does not copy internal game fields onto the public DTO', () => {
		const gameWithInternalFields = {
			id: 'elden-ring',
			title: 'Elden Ring',
			description: 'Menjelajahi Lands Between dalam action RPG dunia terbuka.',
			genre: 'Action RPG',
			platform: 'PlayStation 5',
			developer: 'FromSoftware',
			releaseYear: 2022,
			awardYear: 2022,
			awardRank: 1,
			imageUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring.jpg',
			acquisitionCost: 4200,
			moderationNote: 'internal only',
		} as Game

		const dto = toGameDto(gameWithInternalFields)

		expect(Object.keys(dto).sort()).toEqual([
			'awardRank',
			'awardYear',
			'description',
			'developer',
			'genre',
			'id',
			'imageUrl',
			'platform',
			'releaseYear',
			'title',
		])
		expect(dto).not.toHaveProperty('acquisitionCost')
		expect(dto).not.toHaveProperty('moderationNote')
	})

	it('omits an absent award instead of inventing one', () => {
		const gameWithoutAward = {
			id: 'stardew-valley',
			title: 'Stardew Valley',
			description: 'Memulai hidup baru di sebuah pertanian.',
			genre: 'Simulation',
			platform: 'PC',
			developer: 'ConcernedApe',
			releaseYear: 2016,
		} as Game

		const dto = toGameDto(gameWithoutAward)

		// undefined tidak ikut terserialisasi, jadi client tidak menerima award palsu.
		expect(JSON.parse(JSON.stringify(dto))).not.toHaveProperty('awardYear')
		expect(JSON.parse(JSON.stringify(dto))).not.toHaveProperty('awardRank')
	})

	it('omits an absent cover image instead of inventing one', () => {
		const gameWithoutCover = {
			id: 'stardew-valley',
			title: 'Stardew Valley',
			description: 'Memulai hidup baru di sebuah pertanian.',
			genre: 'Simulation',
			platform: 'PC',
			developer: 'ConcernedApe',
			releaseYear: 2016,
		} as Game

		const dto = toGameDto(gameWithoutCover)

		// Client membedakan "tidak punya sampul" dari "sampul gagal dimuat", jadi
		// field-nya harus benar-benar hilang, bukan berisi string kosong.
		expect(JSON.parse(JSON.stringify(dto))).not.toHaveProperty('imageUrl')
	})

	it('does not copy internal review fields onto the public DTO', () => {
		const reviewWithInternalFields = {
			id: 'review-1',
			gameId: 'elden-ring',
			reviewerName: 'Jordan Lee',
			text: 'Desain dunianya rapi.',
			rating: 5,
			createdAt: '2025-01-15T14:00:00.000Z',
			reporterIpAddress: '203.0.113.7',
			moderationFlag: true,
		} as Review

		const dto = toReviewDto(reviewWithInternalFields)

		expect(Object.keys(dto).sort()).toEqual([
			'createdAt',
			'gameId',
			'id',
			'rating',
			'reviewerName',
			'text',
		])
		expect(dto).not.toHaveProperty('reporterIpAddress')
		expect(dto).not.toHaveProperty('moderationFlag')
	})
})
