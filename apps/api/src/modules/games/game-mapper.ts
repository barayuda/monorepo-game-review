import type { GameDto } from '@game-review/contracts'

import type { Game } from './game.js'

/**
 * Menyalin field publik sebuah game satu per satu ke DTO.
 *
 * `satisfies GameDto` tidak cukup di sini: excess property check hanya berlaku
 * untuk object literal, sehingga field internal yang kelak ditambahkan ke `Game`
 * akan lolos typecheck lalu ikut terserialisasi ke client. Menyebut setiap field
 * secara eksplisit membuat kebocoran itu mustahil.
 */
export const toGameDto = (game: Game): GameDto => ({
	id: game.id,
	title: game.title,
	description: game.description,
	genre: game.genre,
	platform: game.platform,
	developer: game.developer,
	releaseYear: game.releaseYear,
	awardYear: game.awardYear,
	awardRank: game.awardRank,
})
