import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { AwardBadge } from '../src/components/award-badge.js'

describe('AwardBadge', () => {
	afterEach(() => {
		cleanup()
	})

	it('menyebut tahun dan peringkat penghargaan', () => {
		// Menangkap regresi ketika badge kehilangan tahun atau peringkatnya dan jadi tidak bermakna.
		render(<AwardBadge rank={1} year={2022} />)

		expect(screen.getByText(/GOTY 2022/)).toBeTruthy()
		expect(screen.getByText(/#1/)).toBeTruthy()
	})

	it('menjelaskan peringkat satu sebagai pemenang bagi pembaca layar', () => {
		// Angka saja ambigu; status juara harus terbaca tanpa melihat urutan kartu.
		const { container } = render(<AwardBadge rank={1} year={2024} />)

		expect(container.textContent).toContain('Pemenang')
		expect(container.textContent).not.toContain('Nominasi')
	})

	it.each([2, 3])(
		'menjelaskan peringkat %s sebagai nominasi, bukan juara',
		(rank) => {
			// The Game Awards tidak mengumumkan juara dua dan tiga, jadi UI tidak boleh menyiratkannya.
			const { container } = render(<AwardBadge rank={rank} year={2023} />)

			expect(container.textContent).toContain('Nominasi')
			expect(container.textContent).not.toContain('Pemenang')
		},
	)
})
