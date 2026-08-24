import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AppRouter } from '../src/app-router.js'

describe('AppRouter', () => {
	it('menyediakan placeholder detail untuk game yang dipilih', () => {
		const html = renderToStaticMarkup(
			<MemoryRouter initialEntries={['/games/game-1']}>
				<AppRouter />
			</MemoryRouter>,
		)

		expect(html).toContain('Detail game')
		expect(html).toContain('game-1')
	})
})
