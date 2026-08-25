import type { Game } from '../modules/games/game.js'

/**
 * Katalog awal untuk adapter in-memory; dipisahkan dari repository agar data
 * contoh dapat diganti tanpa mengubah kontrak persistence.
 *
 * Isinya adalah peraih dan nominasi Game of the Year lima tahun terakhir
 * (2020–2024), tiga judul per tahun, ditambah beberapa pemenang tahun lebih
 * lama. The Game Awards tidak mengumumkan juara dua dan tiga, jadi peringkat di
 * bawah pemenang diisi nominasi tahun tersebut dan disebut apa adanya.
 */
export const seededGames: readonly Game[] = [
	{
		id: 'astro-bot',
		title: 'Astro Bot',
		description:
			'Pemenang Game of the Year 2024. Platformer 3D yang memperkenalkan satu ide baru di hampir setiap level.',
		genre: 'Platformer',
		platform: 'PlayStation 5',
	},
	{
		id: 'balatro',
		title: 'Balatro',
		description:
			'Nominasi Game of the Year 2024. Poker roguelike yang membangun kombo dari kartu yang tampak biasa saja.',
		genre: 'Roguelike Deckbuilder',
		platform: 'PC',
	},
	{
		id: 'final-fantasy-vii-rebirth',
		title: 'Final Fantasy VII Rebirth',
		description:
			'Nominasi Game of the Year 2024. Bagian kedua dari trilogi remake, dengan dunia terbuka dan pertempuran hibrida.',
		genre: 'Action RPG',
		platform: 'PlayStation 5',
	},
	{
		id: 'baldurs-gate-3',
		title: "Baldur's Gate 3",
		description:
			'Pemenang Game of the Year 2023. RPG berbasis party yang membiarkan hampir semua keputusan mengubah jalan cerita.',
		genre: 'Role-Playing',
		platform: 'PC',
	},
	{
		id: 'tears-of-the-kingdom',
		title: 'The Legend of Zelda: Tears of the Kingdom',
		description:
			'Nominasi Game of the Year 2023. Kemampuan merakit kendaraan dan alat sendiri mengubah cara menjelajah Hyrule.',
		genre: 'Action Adventure',
		platform: 'Nintendo Switch',
	},
	{
		id: 'alan-wake-2',
		title: 'Alan Wake 2',
		description:
			'Nominasi Game of the Year 2023. Horor survival dua alur cerita yang berpindah antara dunia nyata dan tulisan.',
		genre: 'Survival Horror',
		platform: 'PC',
	},
	{
		id: 'elden-ring',
		title: 'Elden Ring',
		description:
			'Pemenang Game of the Year 2022. Menjelajahi Lands Between dalam action RPG dunia terbuka.',
		genre: 'Action RPG',
		platform: 'PlayStation 5',
	},
	{
		id: 'god-of-war-ragnarok',
		title: 'God of War Ragnarök',
		description:
			'Nominasi Game of the Year 2022. Penutup kisah Norse yang memberi Atreus porsi cerita hampir sebesar Kratos.',
		genre: 'Action Adventure',
		platform: 'PlayStation 5',
	},
	{
		id: 'stray',
		title: 'Stray',
		description:
			'Nominasi Game of the Year 2022. Petualangan pendek dari sudut pandang seekor kucing di kota robot.',
		genre: 'Adventure',
		platform: 'PlayStation 5',
	},
	{
		id: 'it-takes-two',
		title: 'It Takes Two',
		description:
			'Pemenang Game of the Year 2021. Petualangan yang hanya bisa dimainkan berdua dan mengganti mekanik tiap babak.',
		genre: 'Co-op Adventure',
		platform: 'PC',
	},
	{
		id: 'deathloop',
		title: 'Deathloop',
		description:
			'Nominasi Game of the Year 2021. Satu pulau, satu hari yang berulang, dan tujuh target yang harus jatuh bersamaan.',
		genre: 'Action',
		platform: 'PlayStation 5',
	},
	{
		id: 'psychonauts-2',
		title: 'Psychonauts 2',
		description:
			'Nominasi Game of the Year 2021. Platformer yang menjadikan isi kepala tiap tokoh sebagai levelnya sendiri.',
		genre: 'Platformer',
		platform: 'Xbox Series X|S',
	},
	{
		id: 'the-last-of-us-part-ii',
		title: 'The Last of Us Part II',
		description:
			'Pemenang Game of the Year 2020. Cerita balas dendam yang memaksa pemain melihatnya dari dua sisi.',
		genre: 'Action Adventure',
		platform: 'PlayStation 4',
	},
	{
		id: 'hades',
		title: 'Hades',
		description:
			'Nominasi Game of the Year 2020. Kabur dari dunia bawah lewat roguelike dengan progres yang murah hati.',
		genre: 'Roguelike',
		platform: 'Nintendo Switch',
	},
	{
		id: 'ghost-of-tsushima',
		title: 'Ghost of Tsushima',
		description:
			'Nominasi Game of the Year 2020. Duel samurai di Tsushima, dengan arah angin menggantikan penunjuk jalan.',
		genre: 'Action Adventure',
		platform: 'PlayStation 4',
	},
	{
		id: 'god-of-war',
		title: 'God of War',
		description:
			'Pemenang Game of the Year 2018. Perjalanan tanpa potongan kamera menyusuri mitologi Norse, antara ayah dan anak.',
		genre: 'Action Adventure',
		platform: 'PlayStation 4',
	},
	{
		id: 'breath-of-the-wild',
		title: 'The Legend of Zelda: Breath of the Wild',
		description:
			'Pemenang Game of the Year 2017. Petualangan terbuka yang membiarkan Hyrule didatangi nyaris dalam urutan apa pun.',
		genre: 'Action Adventure',
		platform: 'Nintendo Switch',
	},
	{
		id: 'witcher-3-wild-hunt',
		title: 'The Witcher 3: Wild Hunt',
		description:
			'Pemenang Game of the Year 2015. Pemburu monster mencari putri angkatnya melintasi benua yang sedang berperang.',
		genre: 'Action RPG',
		platform: 'PC',
	},
	{
		id: 'stardew-valley',
		title: 'Stardew Valley',
		description:
			'Memulai hidup baru di sebuah pertanian di kota kecil yang tenang.',
		genre: 'Simulation',
		platform: 'PC',
	},
]
