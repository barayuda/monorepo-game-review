export interface Review {
	id: string
	gameId: string
	reviewerName: string
	text: string
	rating: number
	createdAt: string
}

export interface CreateReviewInput {
	reviewerName: string
	text: string
	rating: number
}
