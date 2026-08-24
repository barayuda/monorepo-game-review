import { describe, expect, it } from 'vitest'

import { GameService } from '../src/modules/games/game-service.js'
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
