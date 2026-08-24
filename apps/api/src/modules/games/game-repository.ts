import type { Game } from './game.js'

/**
 * Port persistence untuk katalog game. Service bergantung pada kontrak ini
 * agar sumber data dapat diganti tanpa mengubah aturan use case.
 */
export interface GameRepository {
	/** Mengambil seluruh game yang tersedia untuk ditampilkan. */
	findAll(): Game[]

	/** Mengembalikan game berdasarkan id, atau `undefined` bila tidak ada. */
	findById(id: string): Game | undefined
}
