import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { seededGames } from '../src/seed/games.js'

/**
 * Sampul game dimuat dari host pihak ketiga, sehingga dua hal harus tetap benar
 * bersamaan: setiap URL di katalog memang menunjuk ke host itu, dan host itu
 * diizinkan oleh Content-Security-Policy yang disajikan Nginx.
 *
 * Keduanya ditegakkan di sini karena kegagalannya tidak terlihat dari sisi
 * server: API tetap membalas 200, dan gambar baru diblokir di browser pembaca.
 */
const nginxConfig = readFileSync(
	fileURLToPath(new URL('../../web/nginx.conf.template', import.meta.url)),
	'utf8',
)

const imageSourceDirective =
	/img-src\s+([^;]+);/.exec(nginxConfig)?.[1]?.trim() ?? ''

describe('katalog awal', () => {
	it('memberi setiap game sebuah sampul', () => {
		// Menangkap regresi ketika game baru ditambahkan tanpa gambar dan kartunya tampil kosong.
		const withoutCover = seededGames.filter((game) => !game.imageUrl)

		expect(withoutCover.map((game) => game.id)).toEqual([])
	})

	it('hanya memuat sampul lewat HTTPS', () => {
		// Menangkap regresi ketika URL http:// menyusup dan diblokir sebagai mixed content.
		const insecure = seededGames.filter(
			(game) => !game.imageUrl?.startsWith('https://'),
		)

		expect(insecure.map((game) => game.id)).toEqual([])
	})

	it('hanya memakai host sampul yang diizinkan Content-Security-Policy', () => {
		// Menangkap regresi ketika sampul diseed dari host yang belum ada di img-src
		// sehingga browser memblokirnya tanpa error apa pun di sisi server.
		expect(imageSourceDirective).not.toBe('')

		const disallowed = seededGames.filter((game) => {
			const origin = new URL(game.imageUrl ?? 'https://invalid.example').origin

			return !imageSourceDirective.includes(origin)
		})

		expect(disallowed.map((game) => game.id)).toEqual([])
	})
})
