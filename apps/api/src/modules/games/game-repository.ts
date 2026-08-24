import type { Game } from './game.js'

export interface GameRepository {
	findAll(): Game[]
	findById(id: string): Game | undefined
}
