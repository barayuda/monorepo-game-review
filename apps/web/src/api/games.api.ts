import type { GameDto } from '@game-review/contracts'

import { httpClient } from './http-client.js'

/** Akses endpoint game; komponen menggunakan modul ini, bukan `fetch` secara langsung. */
export const gamesApi = {
	list: (signal?: AbortSignal): Promise<GameDto[]> =>
		httpClient.get('/api/games', { signal }),
	getById: (gameId: string, signal?: AbortSignal): Promise<GameDto> =>
		httpClient.get(`/api/games/${gameId}`, { signal }),
}
