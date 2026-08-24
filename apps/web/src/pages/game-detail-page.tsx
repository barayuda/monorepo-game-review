import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { ReviewForm } from '../components/review-form.js'
import { ReviewList } from '../components/review-list.js'
import { gameQueries } from '../queries/game-queries.js'
import { reviewQueries } from '../queries/review-queries.js'

/** Menampilkan identitas lengkap game yang dipilih dari cache server-state detail. */
export function GameDetailPage(): React.ReactNode {
	const { gameId = '' } = useParams()
	const gameQuery = useQuery(gameQueries.byId(gameId))
	const reviewsQuery = useQuery(reviewQueries.byGameId(gameId))

	if (gameQuery.isPending) {
		return (
			<p aria-label="Memuat detail game" role="status">
				Memuat detail game
			</p>
		)
	}

	if (gameQuery.isError) {
		const message =
			gameQuery.error instanceof Error
				? gameQuery.error.message
				: 'Detail game tidak dapat dimuat.'

		return (
			<section className="space-y-3" role="alert">
				<h1 className="text-2xl font-bold">Detail game tidak tersedia</h1>
				<p className="text-slate-300">{message}</p>
			</section>
		)
	}

	if (!gameQuery.data) {
		return null
	}

	const game = gameQuery.data

	return (
		<section className="space-y-6">
			<div className="space-y-3">
				<p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
					Detail game
				</p>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
					{game.title}
				</h1>
				<p className="max-w-3xl text-slate-300">{game.description}</p>
				<div className="flex flex-wrap gap-2 text-sm">
					<span className="rounded-full bg-slate-800 px-3 py-1 text-slate-200">
						{game.genre}
					</span>
					<span className="rounded-full bg-slate-800 px-3 py-1 text-slate-200">
						{game.platform}
					</span>
				</div>
			</div>
			<ReviewForm gameId={gameId} />
			{reviewsQuery.isPending ? (
				<p aria-label="Memuat ulasan" role="status">
					Memuat ulasan
				</p>
			) : reviewsQuery.isError ? (
				<p className="text-rose-300" role="alert">
					{reviewsQuery.error instanceof Error
						? reviewsQuery.error.message
						: 'Ulasan tidak dapat dimuat.'}
				</p>
			) : reviewsQuery.data ? (
				<section aria-labelledby="review-list-title" className="space-y-4">
					<h2 className="text-2xl font-bold" id="review-list-title">
						Ulasan pemain
					</h2>
					<ReviewList reviews={reviewsQuery.data} />
				</section>
			) : null}
		</section>
	)
}
