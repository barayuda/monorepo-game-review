import { QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { AppRouter } from '../src/app-router.js'
import { createAppQueryClient } from '../src/queries/query-client.js'

function renderGameList(): void {
	const queryClient = createAppQueryClient()

	render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={['/']}>
				<AppRouter />
			</MemoryRouter>
		</QueryClientProvider>,
	)
}

describe('halaman daftar game', () => {
	afterEach(() => {
		cleanup()
		vi.unstubAllGlobals()
	})

	it('menunjukkan status pemuatan saat katalog belum tersedia', () => {
		// Menangkap regresi ketika request yang masih berjalan menghasilkan layar kosong.
		vi.stubGlobal(
			'fetch',
			vi.fn(() => new Promise(() => undefined)),
		)

		renderGameList()

		expect(
			screen.getByRole('status', { name: 'Memuat daftar game' }),
		).toBeTruthy()
	})

	it('menampilkan judul, platform, dan genre setiap game dari katalog', async () => {
		// Menangkap regresi ketika kartu menghilangkan metadata yang diperlukan pembaca untuk memilih game.
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify([
						{
							id: 'laut-senja',
							title: 'Laut Senja',
							description: 'Petualangan di pulau terapung.',
							genre: 'Adventure',
							platform: 'PC',
							developer: 'Studio Laut',
							releaseYear: 2024,
						},
						{
							id: 'orbit-merah',
							title: 'Orbit Merah',
							description: 'Strategi membangun koloni.',
							genre: 'Strategy',
							platform: 'Nintendo Switch',
							developer: 'Studio Orbit',
							releaseYear: 2023,
						},
					]),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				),
			),
		)

		renderGameList()

		expect(
			await screen.findByRole('heading', { name: 'Laut Senja' }),
		).toBeTruthy()
		expect(screen.getByText('PC')).toBeTruthy()
		expect(screen.getByText('Adventure')).toBeTruthy()
		expect(screen.getByRole('heading', { name: 'Orbit Merah' })).toBeTruthy()
		expect(screen.getByText('Nintendo Switch')).toBeTruthy()
		expect(screen.getByText('Strategy')).toBeTruthy()
	})

	it('menjelaskan kegagalan API dan memulihkan katalog setelah pengguna mencoba lagi', async () => {
		// Menangkap regresi ketika error API mengunci halaman tanpa pesan atau aksi pemulihan yang nyata.
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValueOnce(
					new Response(
						JSON.stringify({
							code: 'VALIDATION_ERROR',
							message: 'Katalog sedang tidak tersedia.',
						}),
						{ status: 400, headers: { 'content-type': 'application/json' } },
					),
				)
				.mockResolvedValueOnce(
					new Response(
						JSON.stringify([
							{
								id: 'pulau-cerah',
								title: 'Pulau Cerah',
								description: 'Eksplorasi pulau.',
								genre: 'Simulation',
								platform: 'PC',
								developer: 'Studio Pulau',
								releaseYear: 2022,
							},
						]),
						{ status: 200, headers: { 'content-type': 'application/json' } },
					),
				),
		)

		renderGameList()

		expect((await screen.findByRole('alert')).textContent).toContain(
			'Katalog sedang tidak tersedia.',
		)
		await userEvent
			.setup()
			.click(screen.getByRole('button', { name: 'Coba lagi' }))
		expect(
			await screen.findByRole('heading', { name: 'Pulau Cerah' }),
		).toBeTruthy()
	})

	it('menautkan setiap kartu ke URL detail game yang kanonis', async () => {
		// Menangkap regresi ketika kartu mengarahkan pengguna ke URL detail yang tidak dapat dirutekan.
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify([
						{
							id: 'pulau-cerah',
							title: 'Pulau Cerah',
							description: 'Eksplorasi pulau.',
							genre: 'Simulation',
							platform: 'PC',
							developer: 'Studio Pulau',
							releaseYear: 2022,
						},
					]),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				),
			),
		)

		renderGameList()

		const detailLink = await screen.findByRole('link', {
			name: 'Buka detail Pulau Cerah',
		})
		expect(detailLink.getAttribute('href')).toBe('/games/pulau-cerah')
	})

	it('menampilkan studio, tahun rilis, dan peringkat penghargaan pada kartu', async () => {
		// Menangkap regresi ketika field tambahan game hilang dari kartu dan pembaca kehilangan konteks pilihannya.
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify([
						{
							id: 'laut-senja',
							title: 'Laut Senja',
							description: 'Petualangan di pulau terapung.',
							genre: 'Adventure',
							platform: 'PC',
							developer: 'Studio Laut',
							releaseYear: 2024,
							awardYear: 2024,
							awardRank: 1,
						},
					]),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				),
			),
		)

		renderGameList()

		expect(await screen.findByText('Studio Laut')).toBeTruthy()
		expect(screen.getByText('2024')).toBeTruthy()
		expect(screen.getByText(/GOTY 2024/)).toBeTruthy()
	})

	it('tidak menempelkan penghargaan pada game yang tidak pernah menerimanya', async () => {
		// Menangkap regresi ketika badge dirender tanpa data award dan mengarang penghargaan.
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify([
						{
							id: 'pulau-cerah',
							title: 'Pulau Cerah',
							description: 'Eksplorasi pulau.',
							genre: 'Simulation',
							platform: 'PC',
							developer: 'Studio Pulau',
							releaseYear: 2016,
						},
					]),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				),
			),
		)

		renderGameList()

		expect(await screen.findByText('Studio Pulau')).toBeTruthy()
		expect(screen.queryByText(/GOTY/)).toBeNull()
	})

	it('tetap memberi pesan yang terbaca ketika kegagalan bukan Error', async () => {
		// Menangkap regresi ketika penolakan non-Error dirender sebagai [object Object].
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.reject('kegagalan tanpa objek Error')),
		)

		renderGameList()

		// Penolakan non-Error bukan 4xx, jadi kebijakan retry mencobanya dua kali
		// dengan backoff sebelum status error mengendap.
		expect(
			(await screen.findByRole('alert', {}, { timeout: 8_000 })).textContent,
		).toContain('Katalog game tidak dapat dimuat.')
	})
})
