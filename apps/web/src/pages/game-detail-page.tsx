import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { ReviewForm } from '../components/review-form.js'
import { ReviewList } from '../components/review-list.js'
import { ReviewSummary } from '../components/review-summary.js'
import { gameQueries } from '../queries/game-queries.js'
import { reviewQueries } from '../queries/review-queries.js'

/** Menampilkan identitas lengkap game yang dipilih dari cache server-state detail. */
export function GameDetailPage(): React.ReactNode {
	const { gameId = '' } = useParams()
	const gameQuery = useQuery(gameQueries.byId(gameId))
	const reviewsQuery = useQuery(reviewQueries.byGameId(gameId))

	if (gameQuery.isPending) {
		return (
			<p
				aria-label="Memuat detail game"
				className="label-data text-ink-soft"
				role="status"
			>
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
			<section className="max-w-xl space-y-3" role="alert">
				<h1 className="font-display text-3xl font-extrabold">
					Detail game tidak tersedia
				</h1>
				<p className="text-ink-soft">{message}</p>
			</section>
		)
	}

	if (!gameQuery.data) {
		return null
	}

	const game = gameQuery.data

	return (
		<div className="space-y-10">
			<div className="border-b border-rule pb-10">
				<div className="max-w-3xl space-y-4">
					<p className="label-data text-action">Detail game</p>
					<h1 className="font-display text-4xl leading-[1.05] font-extrabold text-balance sm:text-5xl">
						{game.title}
					</h1>
					<p className="text-lg leading-relaxed text-ink-soft">
						{game.description}
					</p>
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft">
						<span className="label-data">{game.platform}</span>
						<span aria-hidden="true" className="text-rule">
							/
						</span>
						<span className="label-data">{game.genre}</span>
					</div>
				</div>
			</div>
			{reviewsQuery.data ? <ReviewSummary reviews={reviewsQuery.data} /> : null}
			{/* Membaca lebih dulu, menulis kemudian: kolom ulasan memimpin dan formulir menempel di sisi kanan. */}
			<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
				<div className="space-y-6">
					{reviewsQuery.isPending ? (
						<p
							aria-label="Memuat ulasan"
							className="label-data text-ink-soft"
							role="status"
						>
							Memuat ulasan
						</p>
					) : reviewsQuery.isError ? (
						<p className="text-danger" role="alert">
							{reviewsQuery.error instanceof Error
								? reviewsQuery.error.message
								: 'Ulasan tidak dapat dimuat.'}
						</p>
					) : reviewsQuery.data ? (
						<section aria-labelledby="review-list-title" className="space-y-4">
							<h2
								className="font-display text-2xl font-extrabold"
								id="review-list-title"
							>
								Ulasan pemain
							</h2>
							<ReviewList reviews={reviewsQuery.data} />
						</section>
					) : null}
				</div>
				<div className="lg:sticky lg:top-8">
					<ReviewForm gameId={gameId} />
				</div>
			</div>
		</div>
	)
}
