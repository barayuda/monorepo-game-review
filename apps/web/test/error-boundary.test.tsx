import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ErrorBoundary } from '../src/error-boundary.js'

function Exploding({ shouldThrow }: { shouldThrow: boolean }): React.ReactNode {
	if (shouldThrow) {
		throw new Error('render meledak')
	}

	return <p>Konten normal</p>
}

describe('ErrorBoundary', () => {
	afterEach(() => {
		cleanup()
	})

	it('meneruskan anaknya selama tidak ada kegagalan', () => {
		render(
			<ErrorBoundary>
				<Exploding shouldThrow={false} />
			</ErrorBoundary>,
		)

		expect(screen.getByText('Konten normal')).toBeTruthy()
	})

	it('menggantikan layar putih dengan penjelasan ketika render gagal', async () => {
		// React menulis galat render ke console; dibungkam agar output suite tetap bersih.
		const consoleError = vi
			.spyOn(console, 'error')
			.mockImplementation(() => undefined)

		render(
			<ErrorBoundary>
				<Exploding shouldThrow={true} />
			</ErrorBoundary>,
		)

		expect(await screen.findByRole('alert')).toBeTruthy()
		expect(screen.getByText('Halaman gagal ditampilkan')).toBeTruthy()
		expect(consoleError).toHaveBeenCalled()
	})

	it('memberi jalan keluar lewat tombol coba lagi', async () => {
		// Menangkap regresi ketika batas galat menjadi jalan buntu permanen.
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const user = userEvent.setup()

		const view = render(
			<ErrorBoundary>
				<Exploding shouldThrow={true} />
			</ErrorBoundary>,
		)
		expect(screen.getByRole('alert')).toBeTruthy()
		// Penyebabnya diperbaiki lebih dulu, lalu tombol mencoba render ulang.
		view.rerender(
			<ErrorBoundary>
				<Exploding shouldThrow={false} />
			</ErrorBoundary>,
		)
		await user.click(screen.getByRole('button', { name: 'Coba lagi' }))

		expect(screen.getByText('Konten normal')).toBeTruthy()
	})
})
