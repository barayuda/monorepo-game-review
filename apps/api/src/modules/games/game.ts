/**
 * Representasi game yang dibagikan antara use case dan adapter persistence.
 */
export interface Game {
	id: string
	title: string
	description: string
	genre: string
	platform: string
	developer: string
	releaseYear: number
	awardYear?: number
	awardRank?: number
}
