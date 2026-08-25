import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		/**
		 * Font tidak boleh diinline menjadi data: URI. Content-Security-Policy
		 * yang disajikan Nginx membatasi `font-src` ke `'self'`, sehingga subset
		 * kecil yang otomatis diinline Vite akan diblokir browser dan hurufnya
		 * diam-diam gagal dimuat tanpa error apa pun di sisi server.
		 *
		 * Mengembalikan `undefined` untuk aset lain berarti ambang bawaan Vite
		 * tetap berlaku bagi gambar kecil.
		 */
		assetsInlineLimit: (filePath: string) =>
			filePath.endsWith('.woff2') ? false : undefined,
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
			},
		},
	},
})
