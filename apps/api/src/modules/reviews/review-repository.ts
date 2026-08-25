import type { Review } from './review.js'

/**
 * Port persistence untuk membaca dan menambahkan ulasan suatu game.
 * Service memakai kontrak ini agar aturan use case tidak bergantung pada media simpan.
 */
export interface ReviewRepository {
	/**
	 * Mengambil ulasan milik game tertentu dalam urutan penyimpanan, yaitu dari
	 * yang paling dulu dibuat. Service bergantung pada jaminan ini untuk memutus
	 * seri ketika dua ulasan punya `createdAt` yang sama persis.
	 */
	findByGameId(gameId: string): Review[]

	/** Menyimpan ulasan yang sudah divalidasi dan mengembalikan hasil tersimpan. */
	create(review: Review): Review
}
