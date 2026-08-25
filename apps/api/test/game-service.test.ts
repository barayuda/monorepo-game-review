import { describe, expect, it } from 'vitest'

import { GameService } from '../src/modules/games/game-service.js'
import type { Game } from '../src/modules/games/game.js'
import { InMemoryGameRepository } from '../src/modules/games/in-memory-game-repository.js'
import { ApplicationNotFoundError } from '../src/shared/application-not-found-error.js'

describe('GameService', () => {
	it('returns every seeded game exactly once', () => {
		const service = new GameService(new InMemoryGameRepository())

		const games = service.listGames()

		expect(games).toHaveLength(8)
		expect(new Set(games.map((game) => game.id)).size).toBe(games.length)
		// Entri pertama dicek utuh supaya bentuk DTO dan urutan katalog tetap terkunci.
		expect(games[0]).toEqual({
			id: 'elden-ring',
			title: 'Elden Ring',
			description:
				'Game of the Year 2022. Explore the Lands Between in an open-world action role-playing game.',
			genre: 'Action RPG',
			platform: 'PlayStation 5',
		})
		for (const game of games) {
			expect(Object.values(game).every((value) => value.length > 0)).toBe(true)
		}
	})

	it('returns a seeded game by id', () => {
		const service = new GameService(new InMemoryGameRepository())

		expect(service.getGameById('elden-ring')).toEqual({
			id: 'elden-ring',
			title: 'Elden Ring',
			description:
				'Game of the Year 2022. Explore the Lands Between in an open-world action role-playing game.',
			genre: 'Action RPG',
			platform: 'PlayStation 5',
		})
	})

	it('throws a typed not-found error for an unknown id', () => {
		const service = new GameService(new InMemoryGameRepository())
		let thrownError: unknown

		try {
			service.getGameById('unknown-game')
		} catch (error) {
			thrownError = error
		}

		expect(thrownError).toBeInstanceOf(ApplicationNotFoundError)
		expect(thrownError).toMatchObject({
			code: 'NOT_FOUND',
			message: "Game with id 'unknown-game' was not found",
		})
	})
})

describe('InMemoryGameRepository', () => {
	it('does not retain mutable caller seed records', () => {
		const games: Game[] = [
			{
				id: 'elden-ring',
				title: 'Elden Ring',
				description: 'Explore the Lands Between.',
				genre: 'Action RPG',
				platform: 'PlayStation 5',
			},
		]
		const repository = new InMemoryGameRepository(games)

		games[0].title = 'Changed by caller'

		expect(repository.findById('elden-ring')).toMatchObject({
			title: 'Elden Ring',
		})
	})

	it('does not expose mutable records from list and single-game reads', () => {
		const repository = new InMemoryGameRepository([
			{
				id: 'elden-ring',
				title: 'Elden Ring',
				description: 'Explore the Lands Between.',
				genre: 'Action RPG',
				platform: 'PlayStation 5',
			},
		])

		const listedGame = repository.findAll()[0]
		listedGame.title = 'Changed from list'
		const foundGame = repository.findById('elden-ring')

		if (!foundGame) {
			throw new Error('Expected seeded game to be found')
		}

		foundGame.title = 'Changed from lookup'

		expect(repository.findAll()[0]).toMatchObject({ title: 'Elden Ring' })
		expect(repository.findById('elden-ring')).toMatchObject({
			title: 'Elden Ring',
		})
	})
})
