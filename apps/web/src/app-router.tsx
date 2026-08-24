import { Route, Routes } from 'react-router-dom'

import { GameListPage } from './pages/game-list-page.js'
import { GameDetailPage } from './pages/game-detail-page.js'

/** Rute halaman aplikasi yang memisahkan katalog aktif dari placeholder detail tahap berikutnya. */
export function AppRouter(): React.ReactNode {
	return (
		<Routes>
			<Route path="/" element={<GameListPage />} />
			<Route path="/games/:gameId" element={<GameDetailPage />} />
			<Route path="*" element={<NotFoundPlaceholder />} />
		</Routes>
	)
}

/** Respons ringan untuk URL yang belum terdaftar sehingga shell tidak berakhir sebagai layar kosong. */
function NotFoundPlaceholder(): React.ReactNode {
	return <p className="text-slate-300">Halaman tidak ditemukan.</p>
}
