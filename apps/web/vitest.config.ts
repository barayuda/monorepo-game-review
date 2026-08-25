import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		// Isolasi dijaga oleh runner, bukan oleh ingatan penulis test: satu file yang
		// lupa membersihkan stub tidak boleh membocorkan state ke file berikutnya.
		restoreMocks: true,
		unstubGlobals: true,
	},
})
