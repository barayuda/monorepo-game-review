import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { AppLayout } from '../src/layout.js'

describe('AppLayout', () => {
	afterEach(() => {
		cleanup()
	})

	it('membungkus halaman dengan landmark dan jalan pulang ke katalog', () => {
		// Menangkap regresi ketika shell kehilangan <main> atau tautan kembali ke beranda.
		render(
			<MemoryRouter initialEntries={['/games/laut-senja']}>
				<AppLayout>
					<p>Isi halaman</p>
				</AppLayout>
			</MemoryRouter>,
		)

		expect(screen.getByRole('main')).toBeTruthy()
		expect(
			screen.getByRole('link', { name: 'Game Review' }).getAttribute('href'),
		).toBe('/')
		expect(screen.getByText('Isi halaman')).toBeTruthy()
	})
})
