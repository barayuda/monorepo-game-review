import { QueryClient } from '@tanstack/react-query'

import { ApiClientError } from '../api/http-client.js'

/** Menentukan apakah kegagalan query layak dicoba lagi tanpa membebani error klien 4xx. */
export function shouldRetryQuery(
	failureCount: number,
	error: unknown,
): boolean {
	// Error transport aplikasi sudah bertipe, jadi tidak perlu menebak bentuknya.
	if (
		error instanceof ApiClientError &&
		error.status >= 400 &&
		error.status < 500
	) {
		return false
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
