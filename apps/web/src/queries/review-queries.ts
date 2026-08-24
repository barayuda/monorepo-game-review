import { queryOptions } from '@tanstack/react-query'

import { reviewsApi } from '../api/reviews.api.js'
import { reviewQueryKeys } from './query-keys.js'

/** Konfigurasi query ulasan tanpa polling; lifecycle pembaruan detail ditambahkan bersama fitur detail pada tahap berikutnya. */
export const reviewQueries = {
	byGameId: (gameId: string) =>
		queryOptions({
			queryKey: reviewQueryKeys.byGameId(gameId),
			queryFn: () => reviewsApi.listByGameId(gameId),
		}),
}
