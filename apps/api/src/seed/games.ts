import type { Game } from '../modules/games/game.js'

/**
 * Katalog awal untuk adapter in-memory; dipisahkan dari repository agar data
 * contoh dapat diganti tanpa mengubah kontrak persistence. Isinya sengaja
 * peraih Game of the Year supaya judulnya dikenali reviewer tanpa penjelasan.
 */
export const seededGames: readonly Game[] = [
	{
		id: 'elden-ring',
		title: 'Elden Ring',
		description:
			'Game of the Year 2022. Explore the Lands Between in an open-world action role-playing game.',
		genre: 'Action RPG',
		platform: 'PlayStation 5',
	},
	{
		id: 'baldurs-gate-3',
		title: "Baldur's Gate 3",
		description:
			'Game of the Year 2023. A party-based role-playing game where almost every choice reshapes the story.',
		genre: 'Role-Playing',
		platform: 'PC',
	},
	{
		id: 'astro-bot',
		title: 'Astro Bot',
		description:
			'Game of the Year 2024. A 3D platformer built around inventive levels and precise controls.',
		genre: 'Platformer',
		platform: 'PlayStation 5',
	},
	{
		id: 'breath-of-the-wild',
		title: 'The Legend of Zelda: Breath of the Wild',
		description:
			'Game of the Year 2017. An open-air adventure that lets you approach Hyrule in almost any order.',
		genre: 'Action Adventure',
		platform: 'Nintendo Switch',
	},
	{
		id: 'god-of-war',
		title: 'God of War',
		description:
			'Game of the Year 2018. A single-shot journey through Norse myth, told between a father and his son.',
		genre: 'Action Adventure',
		platform: 'PlayStation 4',
	},
	{
		id: 'witcher-3-wild-hunt',
		title: 'The Witcher 3: Wild Hunt',
		description:
			'Game of the Year 2015. A monster hunter searches for his adopted daughter across a war-torn continent.',
		genre: 'Action RPG',
		platform: 'PC',
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
