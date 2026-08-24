import { seededGames } from '../../seed/games.js'

import type { Game } from './game.js'
import type { GameRepository } from './game-repository.js'

/**
 * Implementasi repository untuk data lokal. Salinan defensif saat masuk dan
 * keluar mencegah caller mengubah state internal melalui referensi objek.
 */
export class InMemoryGameRepository implements GameRepository {
	private readonly games: readonly Game[]

	/**
	 * Menginisialisasi katalog dari seed atau data pengganti untuk komposisi aplikasi.
	 */
	constructor(games: readonly Game[] = seededGames) {
		this.games = games.map((game) => ({ ...game }))
	}

	/** Mengembalikan salinan seluruh katalog tanpa mengekspos state internal. */
	findAll(): Game[] {
		return this.games.map((game) => ({ ...game }))
	}

	/** Mencari game dan mengembalikan salinannya bila tersedia. */
	findById(id: string): Game | undefined {
		const game = this.games.find((candidate) => candidate.id === id)

		return game ? { ...game } : undefined
	}
}
