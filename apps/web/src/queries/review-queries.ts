import { queryOptions } from '@tanstack/react-query'

import { reviewsApi } from '../api/reviews.api.js'
import { reviewQueryKeys } from './query-keys.js'

/** Konfigurasi query ulasan yang membatasi polling pada detail game aktif agar pembaca lain segera melihat kiriman baru. */
export const reviewQueries = {
	byGameId: (gameId: string) =>
		queryOptions({
			queryKey: reviewQueryKeys.byGameId(gameId),
			queryFn: () => reviewsApi.listByGameId(gameId),
			refetchInterval: 2_000,
			refetchIntervalInBackground: false,
		}),
}
