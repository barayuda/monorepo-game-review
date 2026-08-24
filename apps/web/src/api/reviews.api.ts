import type { CreateReviewRequestDto, ReviewDto } from '@game-review/contracts'

import { httpClient } from './http-client.js'

/** Akses endpoint ulasan yang selalu berada dalam konteks satu game. */
export const reviewsApi = {
	listByGameId: (gameId: string): Promise<ReviewDto[]> =>
		httpClient.get(`/api/games/${gameId}/reviews`),
	create: (
		gameId: string,
		payload: CreateReviewRequestDto,
	): Promise<ReviewDto> =>
		httpClient.post(`/api/games/${gameId}/reviews`, payload),
}
