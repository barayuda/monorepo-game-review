import type { CreateReviewRequestDto, ReviewDto } from '@game-review/contracts'
import {
	queryOptions,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'

import { reviewsApi } from '../api/reviews.api.js'
import { reviewQueryKeys } from './query-keys.js'

/**
 * Memperbarui ulasan tiap dua detik selama observer detail terpasang agar viewer
 * aktif menerima kiriman pengguna lain; TanStack menghentikan interval saat
 * observer dilepas dan opsi background mencegah kerja saat tab tidak aktif.
 */
export const reviewQueries = {
	byGameId: (gameId: string) =>
		queryOptions({
			queryKey: reviewQueryKeys.byGameId(gameId),
			queryFn: ({ signal }) => reviewsApi.listByGameId(gameId, signal),
			refetchInterval: 2_000,
			refetchIntervalInBackground: false,
		}),
}

/** Mutation pembuatan ulasan tetap berada di batas query agar komponen tidak mengetahui transport HTTP. */
export function useCreateReviewMutation(gameId: string) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (payload: CreateReviewRequestDto) =>
			reviewsApi.create(gameId, payload),
		onSuccess: async (createdReview) => {
			const queryKey = reviewQueryKeys.byGameId(gameId)
			await queryClient.cancelQueries({ exact: true, queryKey })
			queryClient.setQueryData<ReviewDto[]>(queryKey, (currentReviews = []) => [
				createdReview,
				...currentReviews.filter((review) => review.id !== createdReview.id),
			])
		},
	})
}
