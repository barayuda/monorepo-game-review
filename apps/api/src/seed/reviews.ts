import type { Review } from '../modules/reviews/review.js'

/**
 * Ulasan awal untuk adapter in-memory, terpisah agar seed bukan bagian dari
 * aturan penyimpanan repository. Satu game sengaja dibiarkan tanpa ulasan
 * supaya empty state ikut terlihat tanpa perlu menghapus data.
 */
export const seededReviews: readonly Review[] = [
	{
		id: 'review-elden-1',
		gameId: 'elden-ring',
		reviewerName: 'Jordan Lee',
		text: 'Its world design makes every detour feel worthwhile.',
		rating: 5,
		createdAt: '2025-01-15T14:00:00.000Z',
	},
	{
		id: 'review-elden-2',
		gameId: 'elden-ring',
		reviewerName: 'Samira Patel',
		text: 'A vast, challenging adventure that rewards curiosity.',
		rating: 5,
		createdAt: '2025-01-20T09:30:00.000Z',
	},
	{
		id: 'review-hades-1',
		gameId: 'hades',
		reviewerName: 'Maya Chen',
		text: 'Fast runs and a generous progression loop make failure fun.',
		rating: 5,
		createdAt: '2025-01-18T17:45:00.000Z',
	},
	{
		id: 'review-baldurs-1',
		gameId: 'baldurs-gate-3',
		reviewerName: 'Putri Rahmawati',
		text: 'Every plan I improvised was handled by the rules instead of refused.',
		rating: 5,
		createdAt: '2025-01-22T11:15:00.000Z',
	},
	{
		id: 'review-baldurs-2',
		gameId: 'baldurs-gate-3',
		reviewerName: 'Tomas Nowak',
		text: 'The third act drags a little, but the companions carry it.',
		rating: 4,
		createdAt: '2025-01-24T08:05:00.000Z',
	},
	{
		id: 'review-astro-1',
		gameId: 'astro-bot',
		reviewerName: 'Nadia Farrell',
		text: 'Short, but almost every level introduces an idea and then retires it.',
		rating: 5,
		createdAt: '2025-01-26T13:40:00.000Z',
	},
	{
		id: 'review-botw-1',
		gameId: 'breath-of-the-wild',
		reviewerName: 'Arif Santoso',
		text: 'Climbing anything you can see still feels remarkable years later.',
		rating: 5,
		createdAt: '2025-01-19T06:20:00.000Z',
	},
	{
		id: 'review-botw-2',
		gameId: 'breath-of-the-wild',
		reviewerName: 'Grace Okafor',
		text: 'Weapon durability frustrated me until I stopped hoarding.',
		rating: 4,
		createdAt: '2025-01-21T15:55:00.000Z',
	},
	{
		id: 'review-gow-1',
		gameId: 'god-of-war',
		reviewerName: 'Dani Prasetyo',
		text: 'The unbroken camera makes the quiet moments land harder than the fights.',
		rating: 5,
		createdAt: '2025-01-17T19:10:00.000Z',
	},
	{
		id: 'review-witcher-1',
		gameId: 'witcher-3-wild-hunt',
		reviewerName: 'Lena Vogel',
		text: 'Side contracts are written with more care than most main quests.',
		rating: 5,
		createdAt: '2025-01-16T10:35:00.000Z',
	},
	{
		id: 'review-witcher-2',
		gameId: 'witcher-3-wild-hunt',
		reviewerName: 'Bagus Wirawan',
		text: 'Combat is the weakest part, and it still never made me stop.',
		rating: 4,
		createdAt: '2025-01-23T20:00:00.000Z',
	},
]
