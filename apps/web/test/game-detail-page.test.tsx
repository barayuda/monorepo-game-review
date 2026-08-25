import type {
	CreateReviewRequestDto,
	GameDto,
	ReviewDto,
} from '@game-review/contracts'
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AppRouter } from '../src/app-router.js'
import { createAppQueryClient } from '../src/queries/query-client.js'
import { reviewQueryKeys } from '../src/queries/query-keys.js'

const game: GameDto = {
	id: 'laut-senja',
	title: 'Laut Senja',
	description: 'Petualangan di pulau terapung.',
	genre: 'Adventure',
	platform: 'PC',
	developer: 'Studio Senja',
	releaseYear: 2024,
}

const existingReview: ReviewDto = {
	id: 'review-old',
	gameId: game.id,
	reviewerName: 'Dimas',
	text: 'Ulasan yang sudah ada.',
	rating: 3,
	createdAt: '2026-08-20T10:00:00.000Z',
}

interface DetailApiOptions {
	reviews?: ReviewDto[]
	postResult?: { body: unknown; status: number }
	onPost?: (url: string, init: RequestInit) => void
}

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	})
}

function stubDetailApi({
	reviews = [],
	postResult,
	onPost,
}: DetailApiOptions = {}): void {
	vi.stubGlobal(
		'fetch',
		vi.fn((input: string | URL | Request, init?: RequestInit) => {
			const url = String(input)
			if (init?.method === 'POST') {
				onPost?.(url, init)
				const payload = JSON.parse(String(init.body)) as CreateReviewRequestDto
				const result = postResult ?? {
					status: 201,
					body: {
						id: 'review-new',
						gameId: game.id,
						...payload,
						createdAt: '2026-08-24T10:00:00.000Z',
					} satisfies ReviewDto,
				}
				return Promise.resolve(jsonResponse(result.body, result.status))
			}

			return Promise.resolve(
				jsonResponse(url.endsWith('/reviews') ? reviews : game),
			)
		}),
	)
}

function renderGameDetail(): QueryClient {
	const queryClient = createAppQueryClient()

	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/games/laut-senja']}>
				<AppRouter />
			</MemoryRouter>
		</QueryClientProvider>,
	)

	return queryClient
}

async function waitForDetail(): Promise<void> {
	await screen.findByRole('heading', { name: game.title })
}

async function fillReviewForm(
	user: ReturnType<typeof userEvent.setup>,
	input: { name: string; text: string; rating?: number },
): Promise<void> {
	await user.type(
		screen.getByRole('textbox', { name: 'Nama reviewer' }),
		input.name,
	)
	await user.type(
		screen.getByRole('textbox', { name: 'Teks ulasan' }),
		input.text,
	)
	if (input.rating !== undefined) {
		await user.click(
			screen.getByRole('radio', { name: `${input.rating} bintang` }),
		)
	}
}

describe('halaman detail game', () => {
	afterEach(() => {
		cleanup()
		vi.unstubAllGlobals()
	})

	it('menjelaskan bahwa detail game sedang dimuat', () => {
		// Menangkap regresi ketika dua request yang masih berjalan menghasilkan layar kosong.
		vi.stubGlobal(
			'fetch',
			vi.fn(() => new Promise(() => undefined)),
		)

		renderGameDetail()

		expect(
			screen.getByRole('status', { name: 'Memuat detail game' }),
		).toBeTruthy()
	})

	it('menampilkan data game yang dipilih', async () => {
		// Menangkap regresi ketika rute detail kembali hanya menampilkan parameter URL.
		stubDetailApi()
		renderGameDetail()

		expect(
			await screen.findByRole('heading', { name: game.title }),
		).toBeTruthy()
		expect(screen.getByText(game.description)).toBeTruthy()
		expect(screen.getByText(game.genre)).toBeTruthy()
		expect(screen.getByText(game.platform)).toBeTruthy()
	})

	it('menampilkan ulasan yang sudah ada', async () => {
		// Menangkap regresi ketika detail game tidak menghubungkan daftar ulasan milik game tersebut.
		stubDetailApi({
			reviews: [
				{
					...existingReview,
					reviewerName: 'Nadia',
					text: 'Dunianya indah dan penuh kejutan.',
					rating: 5,
				},
			],
		})
		renderGameDetail()

		expect(await screen.findByText('Nadia')).toBeTruthy()
		expect(screen.getByText('Dunianya indah dan penuh kejutan.')).toBeTruthy()
		expect(screen.getByLabelText('Rating 5 dari 5')).toBeTruthy()
	})

	it('menjelaskan ketika game belum memiliki ulasan', async () => {
		// Menangkap regresi ketika respons ulasan kosong dirender sebagai ruang tanpa penjelasan.
		stubDetailApi()
		renderGameDetail()

		expect(
			await screen.findByText('Belum ada ulasan untuk game ini.'),
		).toBeTruthy()
	})

	it('menjelaskan ketika game tidak ditemukan', async () => {
		// Menangkap regresi ketika error API detail melempar atau meninggalkan layar kosong.
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				jsonResponse(
					{
						code: 'GAME_NOT_FOUND',
						message: 'Game yang dipilih tidak ditemukan.',
					},
					404,
				),
			),
		)
		renderGameDetail()

		expect((await screen.findByRole('alert')).textContent).toContain(
			'Game yang dipilih tidak ditemukan.',
		)
	})

	it('menjelaskan bahwa ulasan sedang dimuat setelah detail tersedia', async () => {
		// Menangkap regresi ketika pengguna melihat detail tanpa mengetahui status daftar ulasan.
		vi.stubGlobal(
			'fetch',
			vi.fn((input: string | URL | Request) =>
				String(input).endsWith('/reviews')
					? new Promise(() => undefined)
					: Promise.resolve(jsonResponse(game)),
			),
		)
		renderGameDetail()

		expect(
			await screen.findByRole('status', { name: 'Memuat ulasan' }),
		).toBeTruthy()
	})

	it('menjelaskan kegagalan pemuatan ulasan tanpa menyembunyikan game', async () => {
		// Menangkap regresi ketika error daftar ulasan menghapus detail game atau tidak diberitahukan.
		vi.stubGlobal(
			'fetch',
			vi.fn((input: string | URL | Request) =>
				Promise.resolve(
					String(input).endsWith('/reviews')
						? jsonResponse(
								{
									code: 'VALIDATION_ERROR',
									message: 'Ulasan belum dapat dimuat.',
								},
								400,
							)
						: jsonResponse(game),
				),
			),
		)
		renderGameDetail()

		await waitForDetail()
		expect((await screen.findByRole('alert')).textContent).toContain(
			'Ulasan belum dapat dimuat.',
		)
	})

	it('memvalidasi nama reviewer yang wajib diisi', async () => {
		// Menangkap regresi ketika form mengirim nama kosong meski field lain sudah valid.
		stubDetailApi()
		renderGameDetail()
		await waitForDetail()
		const user = userEvent.setup()

		await fillReviewForm(user, {
			name: '   ',
			text: 'Sangat menyenangkan.',
			rating: 4,
		})
		await user.click(screen.getByRole('button', { name: 'Kirim ulasan' }))

		expect(screen.getByText('Nama reviewer wajib diisi.')).toBeTruthy()
	})

	it('memvalidasi teks ulasan yang wajib diisi', async () => {
		// Menangkap regresi ketika form menerima ulasan kosong meski identitas dan rating valid.
		stubDetailApi()
		renderGameDetail()
		await waitForDetail()
		const user = userEvent.setup()

		await fillReviewForm(user, { name: 'Nadia', text: '   ', rating: 4 })
		await user.click(screen.getByRole('button', { name: 'Kirim ulasan' }))

		expect(screen.getByText('Teks ulasan wajib diisi.')).toBeTruthy()
	})

	it('mewajibkan rating integer dalam pilihan 1 sampai 5', async () => {
		// Menangkap regresi ketika payload dapat dikirim tanpa salah satu nilai rating yang diizinkan.
		stubDetailApi()
		renderGameDetail()
		await waitForDetail()
		const user = userEvent.setup()

		await fillReviewForm(user, {
			name: 'Nadia',
			text: 'Sangat menyenangkan.',
		})
		await user.click(screen.getByRole('button', { name: 'Kirim ulasan' }))

		expect(screen.getByText('Pilih rating 1 sampai 5.')).toBeTruthy()
		expect(screen.getAllByRole('radio')).toHaveLength(5)
		expect(screen.getByRole('radio', { name: '1 bintang' })).toBeTruthy()
		expect(screen.getByRole('radio', { name: '5 bintang' })).toBeTruthy()
		expect(screen.queryByRole('radio', { name: '0 bintang' })).toBeNull()
		expect(screen.queryByRole('radio', { name: '6 bintang' })).toBeNull()
	})

	it('mengirim payload valid dengan rating yang dapat dipilih lewat keyboard', async () => {
		// Menangkap regresi pada path, nama field, nilai rating, atau kontrol keyboard form.
		let submittedBody: unknown
		let submittedUrl: string | undefined
		let submittedMethod: string | undefined
		stubDetailApi({
			onPost: (url, init) => {
				submittedUrl = url
				submittedMethod = init.method
				submittedBody = JSON.parse(String(init.body)) as unknown
			},
		})
		renderGameDetail()
		await waitForDetail()
		const user = userEvent.setup()

		await user.type(
			screen.getByRole('textbox', { name: 'Nama reviewer' }),
			'Nadia',
		)
		await user.type(
			screen.getByRole('textbox', { name: 'Teks ulasan' }),
			'Sangat menyenangkan.',
		)
		const rating = screen.getByRole('radio', { name: '4 bintang' })
		rating.focus()
		await user.keyboard('[Space]')
		await user.click(screen.getByRole('button', { name: 'Kirim ulasan' }))

		await waitFor(() => {
			expect(submittedUrl).toBe('/api/games/laut-senja/reviews')
			expect(submittedMethod).toBe('POST')
			expect(submittedBody).toEqual({
				reviewerName: 'Nadia',
				text: 'Sangat menyenangkan.',
				rating: 4,
			})
		})
	})

	it('menampilkan ulasan sukses segera sebagai item terbaru', async () => {
		// Menangkap regresi ketika mutation sukses tetapi cache daftar tetap usang sampai polling berikutnya.
		stubDetailApi({
			reviews: [existingReview],
			postResult: {
				status: 201,
				body: {
					id: 'review-new',
					gameId: game.id,
					reviewerName: 'Nadia',
					text: 'Ulasan terbaru dari saya.',
					rating: 5,
					createdAt: '2026-08-24T10:00:00.000Z',
				} satisfies ReviewDto,
			},
		})
		renderGameDetail()
		await screen.findByText(existingReview.text)
		const user = userEvent.setup()

		await fillReviewForm(user, {
			name: 'Nadia',
			text: 'Ulasan terbaru dari saya.',
			rating: 5,
		})
		await user.click(screen.getByRole('button', { name: 'Kirim ulasan' }))

		await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2))
		const items = screen.getAllByRole('listitem')
		expect(items[0]?.textContent).toContain('Nadia')
		expect(items[0]?.textContent).toContain('Ulasan terbaru dari saya.')
		expect(items[1]?.textContent).toContain(existingReview.reviewerName)
	})

	it('mempertahankan ulasan baru ketika GET lama selesai setelah POST', async () => {
		// Menangkap regresi ketika hasil GET yang dimulai lebih dahulu menimpa DTO mutation di cache.
		let resolveStaleReviews: (response: Response) => void = () => undefined
		let staleTransportSettled = false
		const staleReviewsRequest = new Promise<Response>((resolve) => {
			resolveStaleReviews = resolve
		})
		vi.stubGlobal(
			'fetch',
			vi.fn((input: string | URL | Request, init?: RequestInit) => {
				const url = String(input)
				if (init?.method === 'POST') {
					return Promise.resolve(
						jsonResponse(
							{
								id: 'review-new',
								gameId: game.id,
								reviewerName: 'Nadia',
								text: 'Ulasan yang harus bertahan.',
								rating: 5,
								createdAt: '2026-08-24T10:00:00.000Z',
							} satisfies ReviewDto,
							201,
						),
					)
				}

				return url.endsWith('/reviews')
					? staleReviewsRequest.then((response) => {
							staleTransportSettled = true
							return response
						})
					: Promise.resolve(jsonResponse(game))
			}),
		)
		const queryClient = renderGameDetail()
		await waitForDetail()
		const user = userEvent.setup()

		await fillReviewForm(user, {
			name: 'Nadia',
			text: 'Ulasan yang harus bertahan.',
			rating: 5,
		})
		await user.click(screen.getByRole('button', { name: 'Kirim ulasan' }))
		await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1))
		expect(screen.getByRole('listitem').textContent).toContain('Nadia')

		resolveStaleReviews(jsonResponse([existingReview]))
		await waitFor(() => {
			expect(staleTransportSettled).toBe(true)
			expect(
				queryClient.isFetching({
					queryKey: reviewQueryKeys.byGameId(game.id),
				}),
			).toBe(0)
		})

		expect(screen.getAllByRole('listitem')).toHaveLength(1)
		expect(screen.getByRole('listitem').textContent).toContain('Nadia')
		expect(screen.queryByText(existingReview.text)).toBeNull()
	})

	it('mengosongkan seluruh field setelah pengiriman berhasil', async () => {
		// Menangkap regresi ketika form sukses masih membawa data kiriman sebelumnya.
		stubDetailApi()
		renderGameDetail()
		await waitForDetail()
		const user = userEvent.setup()
		const nameInput = screen.getByRole('textbox', { name: 'Nama reviewer' })
		const textInput = screen.getByRole('textbox', { name: 'Teks ulasan' })
		const rating = screen.getByRole('radio', { name: '5 bintang' })

		await fillReviewForm(user, {
			name: 'Nadia',
			text: 'Ulasan baru.',
			rating: 5,
		})
		await user.click(screen.getByRole('button', { name: 'Kirim ulasan' }))
		await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1))

		expect((nameInput as HTMLInputElement).value).toBe('')
		expect((textInput as HTMLTextAreaElement).value).toBe('')
		expect((rating as HTMLInputElement).checked).toBe(false)
	})

	it('menampilkan error pengiriman sambil mempertahankan seluruh input', async () => {
		// Menangkap regresi ketika kegagalan API tersembunyi atau menghapus pekerjaan pengguna.
		stubDetailApi({
			postResult: {
				status: 400,
				body: {
					code: 'VALIDATION_ERROR',
					message: 'Ulasan gagal disimpan. Coba lagi.',
				},
			},
		})
		renderGameDetail()
		await waitForDetail()
		const user = userEvent.setup()
		const nameInput = screen.getByRole('textbox', { name: 'Nama reviewer' })
		const textInput = screen.getByRole('textbox', { name: 'Teks ulasan' })
		const rating = screen.getByRole('radio', { name: '2 bintang' })

		await fillReviewForm(user, {
			name: 'Nadia',
			text: 'Masih ingin menyimpan teks ini.',
			rating: 2,
		})
		await user.click(screen.getByRole('button', { name: 'Kirim ulasan' }))

		expect((await screen.findByRole('alert')).textContent).toContain(
			'Ulasan gagal disimpan. Coba lagi.',
		)
		expect((nameInput as HTMLInputElement).value).toBe('Nadia')
		expect((textInput as HTMLTextAreaElement).value).toBe(
			'Masih ingin menyimpan teks ini.',
		)
		expect((rating as HTMLInputElement).checked).toBe(true)
	})
})
