import { useQuery } from '@tanstack/react-query'

import { GameCard } from '../components/game-card.js'
import { gameQueries } from '../queries/game-queries.js'

/** Mengelola status pemuatan, gagal, dan berhasil untuk katalog game dari server-state bersama. */
export function GameListPage(): React.ReactNode {
	const gameListQuery = useQuery(gameQueries.list())

	if (gameListQuery.isPending) {
		return (
			<p
				aria-label="Memuat daftar game"
				className="label-data text-ink-soft"
				role="status"
			>
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
			<section className="max-w-xl space-y-4" role="alert">
				<h1 className="font-display text-3xl font-extrabold">
					Katalog game tidak tersedia
				</h1>
				<p className="text-ink-soft">{message}</p>
				<button
					className="label-data rounded-sm bg-action px-4 py-3 text-card transition-colors hover:bg-action-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
					onClick={() => void gameListQuery.refetch()}
					type="button"
				>
					Coba lagi
				</button>
			</section>
		)
	}

	const games = gameListQuery.data ?? []

	return (
		<section className="space-y-10">
			<div className="border-b border-rule pb-10">
				<div className="max-w-2xl space-y-4">
					<p className="label-data text-action">Katalog</p>
					<h1 className="font-display text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl">
						Baca dulu kata pemainnya, baru tekan beli.
					</h1>
					<p className="text-lg leading-relaxed text-ink-soft">
						{games.length} game, dengan ulasan yang ditulis orang yang
						benar-benar memainkannya.
					</p>
				</div>
			</div>
			<div className="grid gap-5 sm:grid-cols-2">
				{games.map((game) => (
					<GameCard game={game} key={game.id} />
				))}
			</div>
		</section>
	)
}
