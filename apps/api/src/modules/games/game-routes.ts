import type { GameDto } from '@game-review/contracts'
import type { FastifyPluginAsync } from 'fastify'

import type { GameService } from './game-service.js'

/**
 * Mendaftarkan endpoint HTTP katalog game dan menyerahkan pengambilan data ke
 * service agar handler hanya menerjemahkan transport ke DTO publik.
 */
export const gameRoutes = (gameService: GameService): FastifyPluginAsync => {
	return async (app) => {
		app.get('/api/games', () => gameService.listGames() satisfies GameDto[])

		app.get<{ Params: { gameId: string } }>(
			'/api/games/:gameId',
			(request) =>
				gameService.getGameById(request.params.gameId) satisfies GameDto,
		)
	}
}
