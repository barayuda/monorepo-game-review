import { useQuery } from '@tanstack/react-query'

import { GameCard } from '../components/game-card.js'
import { gameQueries } from '../queries/game-queries.js'

/** Mengelola status pemuatan, gagal, dan berhasil untuk katalog game dari server-state bersama. */
export function GameListPage(): React.ReactNode {
	const gameListQuery = useQuery(gameQueries.list())

	if (gameListQuery.isPending) {
		return (
			<p aria-label="Memuat daftar game" role="status">
				Memuat daftar game
			</p>
		)
	}

	if (gameListQuery.isError) {
		const message =
			gameListQuery.error instanceof Error
				? gameListQuery.error.message
				: 'Katalog game tidak dapat dimuat.'

		return (
			<section className="space-y-4" role="alert">
				<h1 className="text-2xl font-bold tracking-tight">
					Katalog game tidak tersedia
				</h1>
				<p className="text-slate-300">{message}</p>
				<button
					className="rounded-lg bg-teal-300 px-4 py-2 font-semibold text-slate-950 hover:bg-teal-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
					onClick={() => void gameListQuery.refetch()}
					type="button"
				>
					Coba lagi
				</button>
			</section>
		)
	}

	return (
		<section className="space-y-6">
			<div className="space-y-2">
				<p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
					Game Review
				</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					Pilih game untuk membaca ulasan pemain
				</h1>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				{gameListQuery.data?.map((game) => (
					<GameCard game={game} key={game.id} />
				))}
			</div>
		</section>
	)
}
