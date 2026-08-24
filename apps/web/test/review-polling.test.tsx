import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createAppQueryClient } from '../src/queries/query-client.js'
import { reviewQueries } from '../src/queries/review-queries.js'

function MountedReviewQuery(): React.ReactNode {
	const reviewsQuery = useQuery(reviewQueries.byGameId('laut-senja'))
	return <p>{reviewsQuery.data?.[0]?.text ?? 'Belum ada ulasan'}</p>
}

describe('lifecycle polling ulasan', () => {
	afterEach(() => {
		cleanup()
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	it('melakukan polling hanya selama observer detail terpasang', async () => {
		// Menangkap regresi ketika viewer aktif tidak diperbarui atau timer terus meminta data sesudah unmount.
		vi.useFakeTimers()
		let requestCount = 0
		const fetchMock = vi.fn(() => {
			requestCount += 1
			const reviews =
				requestCount === 1
					? []
					: [
							{
								id: 'review-viewer-lain',
								gameId: 'laut-senja',
								reviewerName: 'Viewer lain',
								text: 'Ulasan dari viewer lain.',
								rating: 4,
								createdAt: '2026-08-24T10:00:00.000Z',
							},
						]

			return Promise.resolve(
				new Response(JSON.stringify(reviews), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
			)
		})
		vi.stubGlobal('fetch', fetchMock)
		const queryClient = createAppQueryClient()

		const view = render(
			<QueryClientProvider client={queryClient}>
				<MountedReviewQuery />
			</QueryClientProvider>,
		)
		await act(async () => {
			await Promise.resolve()
		})
		expect(fetchMock).toHaveBeenCalledTimes(1)

		await act(async () => {
			await vi.advanceTimersByTimeAsync(2_000)
			await Promise.resolve()
			await Promise.resolve()
			await vi.advanceTimersByTimeAsync(0)
		})
		expect(fetchMock).toHaveBeenCalledTimes(2)
		await vi.waitFor(() => {
			expect(screen.getByText('Ulasan dari viewer lain.')).toBeTruthy()
		})

		view.unmount()
		await act(async () => {
			await vi.advanceTimersByTimeAsync(6_000)
		})
		expect(fetchMock).toHaveBeenCalledTimes(2)
	})
})
