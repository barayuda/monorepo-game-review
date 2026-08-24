import { seededGames } from '../../seed/games.js'

import type { Game } from './game.js'
import type { GameRepository } from './game-repository.js'

export class InMemoryGameRepository implements GameRepository {
	private readonly games: readonly Game[]

	constructor(games: readonly Game[] = seededGames) {
		this.games = games
	}

	findAll(): Game[] {
		return [...this.games]
	}

	findById(id: string): Game | undefined {
		return this.games.find((game) => game.id === id)
	}
}
