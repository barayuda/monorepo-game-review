import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		// Isolasi dijaga oleh runner, bukan oleh ingatan penulis test: satu file yang
		// lupa membersihkan stub tidak boleh membocorkan state ke file berikutnya.
		restoreMocks: true,
		unstubGlobals: true,
		coverage: {
			include: ['src/**'],
			// Angka ini dicapai dengan menguji perilaku dan membuang kode mati, bukan
			// dengan menambah assertion kosong. Ambang batas menjaganya tetap begitu.
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100,
			},
		},
	},
})
