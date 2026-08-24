import { QueryClientProvider } from '@tanstack/react-query'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AppRouter } from '../src/app-router.js'
import { createAppQueryClient } from '../src/queries/query-client.js'

describe('AppRouter', () => {
	it('menyediakan halaman katalog pada rute root', () => {
		const html = renderToStaticMarkup(
			<QueryClientProvider client={createAppQueryClient()}>
				<MemoryRouter initialEntries={['/']}>
					<AppRouter />
				</MemoryRouter>
			</QueryClientProvider>,
		)

		expect(html).toContain('Memuat daftar game')
	})

	it('menyediakan halaman detail berbasis query untuk game yang dipilih', () => {
		const html = renderToStaticMarkup(
			<QueryClientProvider client={createAppQueryClient()}>
				<MemoryRouter initialEntries={['/games/game-1']}>
					<AppRouter />
				</MemoryRouter>
			</QueryClientProvider>,
		)

		expect(html).toContain('Memuat detail game')
	})
})
