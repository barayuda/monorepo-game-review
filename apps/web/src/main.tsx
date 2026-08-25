import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app-router.js'
import { ErrorBoundary } from './error-boundary.js'
import { AppLayout } from './layout.js'
import { createAppQueryClient } from './queries/query-client.js'
import './styles.css'

/** Client tunggal dibuat di batas aplikasi agar seluruh rute berbagi cache server-state yang sama. */
const queryClient = createAppQueryClient()

/** Memasang provider router dan server-state sebelum komponen halaman dirender di browser. */
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AppLayout>
					<ErrorBoundary>
						<AppRouter />
					</ErrorBoundary>
				</AppLayout>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>,
)
