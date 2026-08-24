import { defineConfig } from '@playwright/test'

/** Menjalankan acceptance test terhadap server API dan Vite lokal yang sesungguhnya. */
export default defineConfig({
	testDir: './e2e',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		trace: 'retain-on-failure',
	},
	webServer: [
		{
			command: 'pnpm --filter @game-review/api exec tsx src/index.ts',
			url: 'http://127.0.0.1:3000/health',
			reuseExistingServer: !process.env.CI,
		},
		{
			command:
				'pnpm --filter @game-review/web exec vite --host 127.0.0.1 --port 4173 --strictPort',
			url: 'http://127.0.0.1:4173',
			reuseExistingServer: !process.env.CI,
		},
	],
})
