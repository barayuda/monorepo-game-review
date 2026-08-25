import type { Game } from '../modules/games/game.js'

/**
 * Katalog awal untuk adapter in-memory; dipisahkan dari repository agar data
 * contoh dapat diganti tanpa mengubah kontrak persistence.
 *
 * Isinya peraih dan nominasi Game of the Year lima tahun terakhir (2020–2024),
 * tiga judul per tahun, ditambah beberapa pemenang tahun sebelumnya. Satu game
 * sengaja tanpa penghargaan dan tanpa ulasan agar kedua kondisi itu terlihat.
 */
export const seededGames: readonly Game[] = [
	{
		id: 'astro-bot',
		title: 'Astro Bot',
		description:
			'Platformer 3D yang memperkenalkan satu ide baru di hampir setiap level lalu pensiun sebelum bosan.',
		genre: 'Platformer',
		platform: 'PlayStation 5',
		developer: 'Team Asobi',
		releaseYear: 2024,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/a/a9/Astro_Bot_cover_art.jpg',
		awardYear: 2024,
		awardRank: 1,
	},
	{
		id: 'balatro',
		title: 'Balatro',
		description:
			'Poker roguelike yang membangun kombo raksasa dari kartu yang tampak biasa saja.',
		genre: 'Roguelike Deckbuilder',
		platform: 'PC',
		developer: 'LocalThunk',
		releaseYear: 2024,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/8/89/Balatro_cover.jpg',
		awardYear: 2024,
		awardRank: 2,
	},
	{
		id: 'final-fantasy-vii-rebirth',
		title: 'Final Fantasy VII Rebirth',
		description:
			'Bagian kedua trilogi remake, dengan dunia terbuka dan pertempuran yang memadukan aksi dan giliran.',
		genre: 'Action RPG',
		platform: 'PlayStation 5',
		developer: 'Square Enix',
		releaseYear: 2024,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/7/75/Boxart_for_Final_Fantasy_VII_Rebirth.png',
		awardYear: 2024,
		awardRank: 3,
	},
	{
		id: 'baldurs-gate-3',
		title: "Baldur's Gate 3",
		description:
			'RPG berbasis party yang membiarkan hampir semua keputusan mengubah jalan cerita.',
		genre: 'Role-Playing',
		platform: 'PC',
		developer: 'Larian Studios',
		releaseYear: 2023,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/1/12/Baldur%27s_Gate_3_cover_art.jpg',
		awardYear: 2023,
		awardRank: 1,
	},
	{
		id: 'tears-of-the-kingdom',
		title: 'The Legend of Zelda: Tears of the Kingdom',
		description:
			'Kemampuan merakit kendaraan dan alat sendiri mengubah cara menjelajah Hyrule.',
		genre: 'Action Adventure',
		platform: 'Nintendo Switch',
		developer: 'Nintendo',
		releaseYear: 2023,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
		awardYear: 2023,
		awardRank: 2,
	},
	{
		id: 'alan-wake-2',
		title: 'Alan Wake 2',
		description:
			'Horor survival dua alur cerita yang berpindah antara dunia nyata dan tulisan.',
		genre: 'Survival Horror',
		platform: 'PC',
		developer: 'Remedy Entertainment',
		releaseYear: 2023,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/e/ed/Alan_Wake_2_box_art.jpg',
		awardYear: 2023,
		awardRank: 3,
	},
	{
		id: 'elden-ring',
		title: 'Elden Ring',
		description: 'Menjelajahi Lands Between dalam action RPG dunia terbuka.',
		genre: 'Action RPG',
		platform: 'PlayStation 5',
		developer: 'FromSoftware',
		releaseYear: 2022,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg',
		awardYear: 2022,
		awardRank: 1,
	},
	{
		id: 'god-of-war-ragnarok',
		title: 'God of War Ragnarök',
		description:
			'Penutup kisah Norse yang memberi Atreus porsi cerita hampir sebesar Kratos.',
		genre: 'Action Adventure',
		platform: 'PlayStation 5',
		developer: 'Santa Monica Studio',
		releaseYear: 2022,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg',
		awardYear: 2022,
		awardRank: 2,
	},
	{
		id: 'stray',
		title: 'Stray',
		description:
			'Petualangan pendek dari sudut pandang seekor kucing di kota yang dihuni robot.',
		genre: 'Adventure',
		platform: 'PlayStation 5',
		developer: 'BlueTwelve Studio',
		releaseYear: 2022,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/f/f1/Stray_cover_art.jpg',
		awardYear: 2022,
		awardRank: 3,
	},
	{
		id: 'it-takes-two',
		title: 'It Takes Two',
		description:
			'Petualangan yang hanya bisa dimainkan berdua dan mengganti mekaniknya tiap babak.',
		genre: 'Co-op Adventure',
		platform: 'PC',
		developer: 'Hazelight Studios',
		releaseYear: 2021,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/a/aa/It_Takes_Two_cover_art.png',
		awardYear: 2021,
		awardRank: 1,
	},
	{
		id: 'deathloop',
		title: 'Deathloop',
		description:
			'Satu pulau, satu hari yang berulang, dan tujuh target yang harus jatuh di hari yang sama.',
		genre: 'Action',
		platform: 'PlayStation 5',
		developer: 'Arkane Lyon',
		releaseYear: 2021,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/c/cb/Deathloop_cover_art.jpg',
		awardYear: 2021,
		awardRank: 2,
	},
	{
		id: 'psychonauts-2',
		title: 'Psychonauts 2',
		description:
			'Platformer yang menjadikan isi kepala tiap tokoh sebagai levelnya sendiri.',
		genre: 'Platformer',
		platform: 'Xbox Series X|S',
		developer: 'Double Fine Productions',
		releaseYear: 2021,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/2/23/Psychonauts_2_cover.png',
		awardYear: 2021,
		awardRank: 3,
	},
	{
		id: 'the-last-of-us-part-ii',
		title: 'The Last of Us Part II',
		description:
			'Cerita balas dendam yang memaksa pemain melihat kejadian yang sama dari dua sisi.',
		genre: 'Action Adventure',
		platform: 'PlayStation 4',
		developer: 'Naughty Dog',
		releaseYear: 2020,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/4/4f/TLOU_P2_Box_Art_2.png',
		awardYear: 2020,
		awardRank: 1,
	},
	{
		id: 'hades',
		title: 'Hades',
		description:
			'Kabur dari dunia bawah lewat roguelike dengan progres yang murah hati.',
		genre: 'Roguelike',
		platform: 'Nintendo Switch',
		developer: 'Supergiant Games',
		releaseYear: 2020,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg',
		awardYear: 2020,
		awardRank: 2,
	},
	{
		id: 'ghost-of-tsushima',
		title: 'Ghost of Tsushima',
		description:
			'Duel samurai di Tsushima, dengan arah angin menggantikan penunjuk jalan.',
		genre: 'Action Adventure',
		platform: 'PlayStation 4',
		developer: 'Sucker Punch Productions',
		releaseYear: 2020,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/b/b6/Ghost_of_Tsushima.jpg',
		awardYear: 2020,
		awardRank: 3,
	},
	{
		id: 'god-of-war',
		title: 'God of War',
		description:
			'Perjalanan tanpa potongan kamera menyusuri mitologi Norse, antara seorang ayah dan anaknya.',
		genre: 'Action Adventure',
		platform: 'PlayStation 4',
		developer: 'Santa Monica Studio',
		releaseYear: 2018,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg',
		awardYear: 2018,
		awardRank: 1,
	},
	{
		id: 'breath-of-the-wild',
		title: 'The Legend of Zelda: Breath of the Wild',
		description:
			'Petualangan terbuka yang membiarkan Hyrule didatangi nyaris dalam urutan apa pun.',
		genre: 'Action Adventure',
		platform: 'Nintendo Switch',
		developer: 'Nintendo',
		releaseYear: 2017,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
		awardYear: 2017,
		awardRank: 1,
	},
	{
		id: 'witcher-3-wild-hunt',
		title: 'The Witcher 3: Wild Hunt',
		description:
			'Pemburu monster mencari putri angkatnya melintasi benua yang sedang berperang.',
		genre: 'Action RPG',
		platform: 'PC',
		developer: 'CD Projekt Red',
		releaseYear: 2015,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg',
		awardYear: 2015,
		awardRank: 1,
	},
	{
		id: 'stardew-valley',
		title: 'Stardew Valley',
		description:
			'Memulai hidup baru di sebuah pertanian di kota kecil yang tenang.',
		genre: 'Simulation',
		platform: 'PC',
		developer: 'ConcernedApe',
		releaseYear: 2016,
		imageUrl:
			'https://upload.wikimedia.org/wikipedia/en/f/fd/Logo_of_Stardew_Valley.png',
	},
]
