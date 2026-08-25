import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { GameCover } from '../src/components/game-cover.js'

const coverUrl = 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring.jpg'

describe('sampul game', () => {
	afterEach(cleanup)

	it('memuat sampul dari URL katalog', () => {
		// Menangkap regresi ketika komponen mengabaikan URL yang sudah dikirim API.
		const { container } = render(
			<GameCover imageUrl={coverUrl} title="Elden Ring" />,
		)

		expect(container.querySelector('img')?.getAttribute('src')).toBe(coverUrl)
	})

	it('memperlakukan sampul sebagai dekoratif karena judulnya sudah berdampingan', () => {
		// Menangkap regresi ketika alt diisi ulang dengan judul dan pembaca layar
		// mengumumkan game yang sama dua kali berturut-turut.
		const { container } = render(
			<GameCover imageUrl={coverUrl} title="Elden Ring" />,
		)

		expect(container.querySelector('img')?.getAttribute('alt')).toBe('')
		expect(screen.queryByRole('img')).toBeNull()
	})

	it('menunda pemuatan sampul yang belum terlihat', () => {
		// Menangkap regresi ketika sembilan belas sampul diunduh sekaligus saat halaman dibuka.
		const { container } = render(
			<GameCover imageUrl={coverUrl} title="Elden Ring" />,
		)

		const image = container.querySelector('img')
		expect(image?.getAttribute('loading')).toBe('lazy')
		expect(image?.getAttribute('decoding')).toBe('async')
	})

	it('menampilkan penanda cadangan ketika game memang tidak punya sampul', () => {
		// Menangkap regresi ketika field opsional yang kosong menyisakan kotak kosong.
		const { container } = render(<GameCover title="Stardew Valley" />)

		expect(container.querySelector('img')).toBeNull()
		expect(screen.getByText('S')).toBeTruthy()
	})

	it('beralih ke penanda cadangan ketika sampul gagal dimuat', () => {
		// Host sampul berada di luar kendali aplikasi, jadi tautan mati harus
		// menurunkan tampilan dengan rapi, bukan menyisakan ikon gambar rusak.
		const { container } = render(
			<GameCover imageUrl={coverUrl} title="Elden Ring" />,
		)

		const image = container.querySelector('img')
		expect(image).not.toBeNull()
		fireEvent.error(image as HTMLImageElement)

		expect(container.querySelector('img')).toBeNull()
		expect(screen.getByText('E')).toBeTruthy()
	})
})
