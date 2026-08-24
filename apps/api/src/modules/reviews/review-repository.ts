import type { Review } from './review.js'

/**
 * Port persistence untuk membaca dan menambahkan ulasan suatu game.
 * Service memakai kontrak ini agar aturan use case tidak bergantung pada media simpan.
 */
export interface ReviewRepository {
	/** Mengambil ulasan milik game tertentu; pengurutan ditentukan oleh service. */
	findByGameId(gameId: string): Review[]

	/** Menyimpan ulasan yang sudah divalidasi dan mengembalikan hasil tersimpan. */
	create(review: Review): Review
}
