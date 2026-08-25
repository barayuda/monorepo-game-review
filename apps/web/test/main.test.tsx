import { QueryClientProvider } from '@tanstack/react-query'
import { isValidElement, type ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const render = vi.fn()

vi.mock('react-dom/client', () => ({
	createRoot: vi.fn(() => ({ render, unmount: vi.fn() })),
}))

/** Menelusuri pohon elemen React untuk memastikan sebuah provider benar-benar terpasang. */
function containsType(node: unknown, type: unknown): boolean {
	if (!isValidElement(node)) {
		return false
	}

	const element = node as ReactElement<{ children?: unknown }>
	if (element.type === type) {
		return true
	}

	const children = element.props.children
	const list = Array.isArray(children) ? children : [children]

	return list.some((child) => containsType(child, type))
}

describe('bootstrap aplikasi', () => {
	beforeEach(() => {
		render.mockClear()
		document.body.innerHTML = '<div id="root"></div>'
	})

	it('memasang router dan cache server-state sebelum halaman dirender', async () => {
		// Menangkap regresi ketika salah satu provider hilang dan seluruh aplikasi
		// gagal saat dijalankan sungguhan, meski setiap test komponen tetap hijau.
		const { createRoot } = await import('react-dom/client')
		await import('../src/main.js')

		expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'))
		expect(render).toHaveBeenCalledTimes(1)

		const tree = render.mock.calls[0]?.[0]
		expect(containsType(tree, QueryClientProvider)).toBe(true)
		expect(containsType(tree, BrowserRouter)).toBe(true)
	})
})
