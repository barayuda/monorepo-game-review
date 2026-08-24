import { ApplicationNotFoundError } from '../../shared/application-not-found-error.js'

import type { Game } from './game.js'
import type { GameRepository } from './game-repository.js'

export class GameService {
	constructor(private readonly gameRepository: GameRepository) {}

	listGames(): Game[] {
		return this.gameRepository.findAll()
	}

	getGameById(id: string): Game {
		const game = this.gameRepository.findById(id)

		if (!game) {
			throw new ApplicationNotFoundError('Game', id)
		}

		return game
	}
}
