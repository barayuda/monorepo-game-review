import { Route, Routes, useParams } from 'react-router-dom'

/** Rute halaman aplikasi yang sengaja hanya menyediakan shell sampai fitur katalog dan detail ditambahkan. */
export function AppRouter(): React.ReactNode {
	return (
		<Routes>
			<Route path="/" element={<HomePlaceholder />} />
			<Route path="/games/:gameId" element={<GameDetailPlaceholder />} />
			<Route path="*" element={<NotFoundPlaceholder />} />
		</Routes>
	)
}

/** Placeholder katalog yang memberi titik boot stabil untuk fitur daftar game berikutnya. */
function HomePlaceholder(): React.ReactNode {
	return (
		<section className="space-y-3">
			<p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
				Game Review
			</p>
			<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
				Katalog game segera hadir
			</h1>
			<p className="max-w-2xl text-slate-300">
				Pilih game untuk membaca dan menulis ulasan pemain.
			</p>
		</section>
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
