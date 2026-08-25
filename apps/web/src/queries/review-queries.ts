import type { CreateReviewRequestDto, ReviewDto } from '@game-review/contracts'
import {
	queryOptions,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'

import { reviewsApi } from '../api/reviews.api.js'
import { reviewQueryKeys } from './query-keys.js'

/** Jeda dasar polling saat server sehat. */
const POLL_INTERVAL_MS = 2_000

/** Batas atas mundur teratur agar tab yang ditinggalkan tidak menghantam server terus-menerus. */
const MAX_POLL_INTERVAL_MS = 30_000

/**
 * Memperbarui ulasan tiap dua detik selama observer detail terpasang agar viewer
 * aktif menerima kiriman pengguna lain; TanStack menghentikan interval saat
 * observer dilepas dan opsi background mencegah kerja saat tab tidak aktif.
 *
 * Ketika permintaan gagal, jeda digandakan sampai batas atas lalu pulih sendiri
 * begitu satu permintaan berhasil. Tanpa ini satu tab yang dibiarkan terbuka
 * akan terus menembak API yang sedang mati setiap dua detik tanpa henti.
 */
export const reviewQueries = {
	byGameId: (gameId: string) =>
		queryOptions({
			queryKey: reviewQueryKeys.byGameId(gameId),
			queryFn: ({ signal }) => reviewsApi.listByGameId(gameId, signal),
			refetchInterval: (query) =>
				Math.min(
					POLL_INTERVAL_MS * 2 ** query.state.fetchFailureCount,
					MAX_POLL_INTERVAL_MS,
				),
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
