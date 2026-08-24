import { QueryClient } from '@tanstack/react-query'

/** Menentukan apakah kegagalan query layak dicoba lagi tanpa membebani error klien 4xx. */
export function shouldRetryQuery(
	failureCount: number,
	error: unknown,
): boolean {
	if (typeof error === 'object' && error !== null && 'status' in error) {
		const status = error.status
		if (typeof status === 'number' && status >= 400 && status < 500) {
			return false
		}
	}

	return failureCount < 2
}

/** Membuat client server-state tunggal dengan cache dan retry yang aman untuk aplikasi browser. */
export function createAppQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 30_000,
				gcTime: 5 * 60_000,
				refetchOnWindowFocus: false,
				refetchOnReconnect: true,
				retry: shouldRetryQuery,
				retryDelay: (attemptIndex) =>
					Math.min(1_000 * 2 ** attemptIndex, 30_000),
			},
			mutations: {
				retry: false,
			},
		},
	})
}
