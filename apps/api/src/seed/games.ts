import type { Game } from '../modules/games/game.js'

export const seededGames: readonly Game[] = [
	{
		id: 'elden-ring',
		title: 'Elden Ring',
		description:
			'Explore the Lands Between in an open-world action role-playing game.',
		genre: 'Action RPG',
		platform: 'PlayStation 5',
	},
	{
		id: 'hades',
		title: 'Hades',
		description:
			'Battle out of the underworld in this roguelike dungeon crawler.',
		genre: 'Roguelike',
		platform: 'Nintendo Switch',
	},
	{
		id: 'stardew-valley',
		title: 'Stardew Valley',
		description: 'Build a new life on a farm in a charming country town.',
		genre: 'Simulation',
		platform: 'PC',
	},
]
