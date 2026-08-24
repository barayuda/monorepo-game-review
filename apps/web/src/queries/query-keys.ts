/** Factory key cache game; array baru selalu memiliki nilai stabil untuk TanStack Query. */
export const gameQueryKeys = {
	all: ['games'] as const,
	lists: () => [...gameQueryKeys.all, 'list'] as const,
	details: () => [...gameQueryKeys.all, 'detail'] as const,
	detail: (gameId: string) => [...gameQueryKeys.details(), gameId] as const,
}

/** Factory key cache ulasan yang mengisolasi data berdasarkan identitas game. */
export const reviewQueryKeys = {
	all: ['reviews'] as const,
	byGameId: (gameId: string) =>
		[...reviewQueryKeys.all, 'by-game', gameId] as const,
}
