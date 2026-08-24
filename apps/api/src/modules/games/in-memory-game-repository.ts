import { seededGames } from '../../seed/games.js'

import type { Game } from './game.js'
import type { GameRepository } from './game-repository.js'

export class InMemoryGameRepository implements GameRepository {
	private readonly games: readonly Game[]

	constructor(games: readonly Game[] = seededGames) {
		this.games = games.map((game) => ({ ...game }))
	}

	findAll(): Game[] {
		return this.games.map((game) => ({ ...game }))
	}

	findById(id: string): Game | undefined {
		const game = this.games.find((candidate) => candidate.id === id)

		return game ? { ...game } : undefined
	}
}
