/**
 * Ulasan yang sudah tersimpan dan selalu terkait dengan satu game.
 */
export interface Review {
	id: string
	gameId: string
	reviewerName: string
	text: string
	rating: number
	createdAt: string
}

/**
 * Data yang diterima use case sebelum service menormalisasi dan memvalidasinya.
 */
export interface CreateReviewInput {
	reviewerName: string
	text: string
	rating: number
}
