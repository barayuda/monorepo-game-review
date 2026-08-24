import { queryOptions } from '@tanstack/react-query'

import { gamesApi } from '../api/games.api.js'
import { gameQueryKeys } from './query-keys.js'

/** Konfigurasi query game dipusatkan agar halaman hanya memilih data tanpa mengatur transport atau cache. */
export const gameQueries = {
	list: () =>
		queryOptions({
			queryKey: gameQueryKeys.lists(),
			queryFn: gamesApi.list,
		}),
	byId: (gameId: string) =>
		queryOptions({
			queryKey: gameQueryKeys.detail(gameId),
			queryFn: () => gamesApi.getById(gameId),
		}),
}
