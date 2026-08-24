import { describe, expect, it } from 'vitest'

import { GameService } from '../src/modules/games/game-service.js'
import type { Game } from '../src/modules/games/game.js'
import { InMemoryGameRepository } from '../src/modules/games/in-memory-game-repository.js'
import { ApplicationNotFoundError } from '../src/shared/application-not-found-error.js'

describe('GameService', () => {
	it('returns all seeded games', () => {
		const service = new GameService(new InMemoryGameRepository())

		expect(service.listGames()).toEqual([
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

	it('returns a seeded game by id', () => {
		const service = new GameService(new InMemoryGameRepository())

		expect(service.getGameById('elden-ring')).toEqual({
			id: 'elden-ring',
			title: 'Elden Ring',
			description:
				'Explore the Lands Between in an open-world action role-playing game.',
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
