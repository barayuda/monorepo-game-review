import { ApplicationNotFoundError } from '../../shared/application-not-found-error.js'

import type { Game } from './game.js'
import type { GameRepository } from './game-repository.js'

/**
 * Menjalankan use case pembacaan game dan menerjemahkan hasil repository yang
 * kosong menjadi error aplikasi yang konsisten.
 */
export class GameService {
	/** Repository disuntikkan agar use case tidak terikat ke adapter data tertentu. */
	constructor(private readonly gameRepository: GameRepository) {}

	/** Menyediakan katalog game kepada caller tanpa menambah aturan domain baru. */
	listGames(): Game[] {
		return this.gameRepository.findAll()
	}

	/**
	 * Mengambil satu game yang wajib ada.
	 *
	 * @throws {ApplicationNotFoundError} Bila id tidak ada di katalog.
	 */
	getGameById(id: string): Game {
		const game = this.gameRepository.findById(id)

		if (!game) {
			throw new ApplicationNotFoundError('Game', id)
		}

		return game
	}
}
