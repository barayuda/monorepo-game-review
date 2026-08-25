import type { GameDto, ReviewDto } from '@game-review/contracts'
import { QueryClientProvider } from '@tanstack/react-query'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AppRouter } from '../src/app-router.js'
import { createAppQueryClient } from '../src/queries/query-client.js'

const game: GameDto = {
	id: 'laut-senja',
	title: 'Laut Senja',
	description: 'Petualangan di pulau terapung.',
	genre: 'Adventure',
	platform: 'PC',
	developer: 'Studio Laut',
	releaseYear: 2024,
}

const existingReview: ReviewDto = {
	id: 'review-lama',
	gameId: game.id,
	reviewerName: 'Dimas',
	text: 'Ulasan yang sudah dibaca.',
	rating: 4,
	createdAt: '2026-08-20T10:00:00.000Z',
}

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	})
}

describe('kegagalan polling ulasan', () => {
	afterEach(() => {
		cleanup()
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	it('mempertahankan ulasan yang sudah tampil ketika polling berikutnya gagal', async () => {
		// Menangkap regresi ketika satu poll gagal menghapus daftar yang sedang dibaca pengguna.
		vi.useFakeTimers()
		let reviewRequestCount = 0
		vi.stubGlobal(
			'fetch',
			vi.fn((input: string | URL | Request) => {
				const url = String(input)
				if (!url.endsWith('/reviews')) {
					return Promise.resolve(jsonResponse(game))
				}

				reviewRequestCount += 1
				// Permintaan pertama berhasil, sisanya gagal dengan 400 supaya tidak diulang retry.
				return Promise.resolve(
					reviewRequestCount === 1
						? jsonResponse([existingReview])
						: jsonResponse(
								{ code: 'VALIDATION_ERROR', message: 'Ulasan gagal dimuat.' },
								400,
							),
				)
			}),
		)

		render(
			<QueryClientProvider client={createAppQueryClient()}>
				<MemoryRouter initialEntries={['/games/laut-senja']}>
					<AppRouter />
				</MemoryRouter>
			</QueryClientProvider>,
		)

		await act(async () => {
			await vi.advanceTimersByTimeAsync(0)
		})
		expect(screen.getByText(existingReview.text)).toBeTruthy()

		await act(async () => {
			await vi.advanceTimersByTimeAsync(2_000)
			await Promise.resolve()
			await Promise.resolve()
			await vi.advanceTimersByTimeAsync(0)
		})

		expect(reviewRequestCount).toBeGreaterThan(1)
		await vi.waitFor(() => {
			expect(screen.getByText(/Gagal memperbarui/)).toBeTruthy()
		})
		// Ulasan lama tetap terbaca meski pembaruannya gagal.
		expect(screen.getByText(existingReview.text)).toBeTruthy()
	})
})
