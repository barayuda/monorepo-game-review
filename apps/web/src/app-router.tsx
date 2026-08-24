import { Route, Routes, useParams } from 'react-router-dom'

import { GameListPage } from './pages/game-list-page.js'

/** Rute halaman aplikasi yang memisahkan katalog aktif dari placeholder detail tahap berikutnya. */
export function AppRouter(): React.ReactNode {
	return (
		<Routes>
			<Route path="/" element={<GameListPage />} />
			<Route path="/games/:gameId" element={<GameDetailPlaceholder />} />
			<Route path="*" element={<NotFoundPlaceholder />} />
		</Routes>
	)
}

/** Placeholder detail mempertahankan parameter rute sebagai kontrak sebelum data game dirender. */
function GameDetailPlaceholder(): React.ReactNode {
	const { gameId } = useParams()

	return (
		<section className="space-y-3">
			<p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
				Detail game
			</p>
			<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
				{gameId}
			</h1>
			<p className="text-slate-300">
				Halaman detail dan ulasan akan tersedia pada tahap berikutnya.
			</p>
		</section>
	)
}

/** Respons ringan untuk URL yang belum terdaftar sehingga shell tidak berakhir sebagai layar kosong. */
function NotFoundPlaceholder(): React.ReactNode {
	return <p className="text-slate-300">Halaman tidak ditemukan.</p>
}
