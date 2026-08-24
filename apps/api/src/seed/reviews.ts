import type { Review } from '../modules/reviews/review.js'

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
]
