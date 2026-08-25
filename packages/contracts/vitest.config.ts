import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		// Package ini hanya berisi tipe, jadi memang tidak punya test untuk dijalankan.
		passWithNoTests: true,
	},
})
