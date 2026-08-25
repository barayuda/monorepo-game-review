import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import { AwardBadge } from '../components/award-badge.js'
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
			<section className="max-w-xl space-y-4" role="alert">
				<h1 className="font-display text-3xl font-bold">
					Detail game tidak tersedia
				</h1>
				<p className="text-ink-soft">{message}</p>
				{/* Tanpa dua jalan keluar ini, URL game yang salah membuat pembaca terjebak. */}
				<div className="flex flex-wrap items-center gap-3">
					<button
						className="label-field rounded-sm bg-action px-4 py-3 text-card transition-colors hover:bg-action-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
						onClick={() => void gameQuery.refetch()}
						type="button"
					>
						Coba lagi
					</button>
					<Link
						className="label-data text-action underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
						to="/"
					>
						Kembali ke katalog
					</Link>
				</div>
			</section>
		)
	}

	// TypeScript sudah mempersempit `data` setelah dua guard di atas, jadi tidak
	// ada cabang ketiga yang perlu ditangani di sini.
	const game = gameQuery.data

	return (
		<div className="space-y-10">
			<div className="rise border-b border-rule pb-10">
				<div className="max-w-3xl space-y-4">
					<p className="label-data text-action">Detail game</p>
					<h1 className="font-display text-4xl leading-[1.02] font-bold text-balance sm:text-6xl">
						{game.title}
					</h1>
					<p className="prose-review text-xl text-ink-soft">
						{game.description}
					</p>
					<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft">
						<span className="label-data">{game.platform}</span>
						<span aria-hidden="true" className="text-rule">
							/
						</span>
						<span className="label-data">{game.genre}</span>
						<span aria-hidden="true" className="text-rule">
							/
						</span>
						<span className="label-data">{game.developer}</span>
						<span aria-hidden="true" className="text-rule">
							/
						</span>
						<span className="label-data">{game.releaseYear}</span>
					</div>
					{game.awardYear && game.awardRank ? (
						<AwardBadge rank={game.awardRank} year={game.awardYear} />
					) : null}
				</div>
			</div>
			{reviewsQuery.data ? <ReviewSummary reviews={reviewsQuery.data} /> : null}
			{/* Membaca lebih dulu, menulis kemudian: kolom ulasan memimpin dan formulir menempel di sisi kanan. */}
			<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
				<div className="space-y-6">
					{reviewsQuery.data ? (
						<>
							{/* Polling gagal tidak boleh menghapus ulasan yang sedang dibaca; cukup beri tahu bahwa datanya berhenti diperbarui. */}
							{reviewsQuery.isError ? (
								<p
									className="label-data rounded-sm border border-danger/30 bg-danger/8 px-4 py-3 text-danger"
									role="status"
								>
									Gagal memperbarui. Menampilkan ulasan terakhir.
								</p>
							) : null}
							<section
								aria-labelledby="review-list-title"
								className="space-y-4"
							>
								<h2
									className="font-display text-2xl font-bold"
									id="review-list-title"
								>
									Ulasan pemain
								</h2>
								<ReviewList reviews={reviewsQuery.data} />
							</section>
						</>
					) : reviewsQuery.isError ? (
						<p className="text-danger" role="alert">
							{reviewsQuery.error instanceof Error
								? reviewsQuery.error.message
								: 'Ulasan tidak dapat dimuat.'}
						</p>
					) : (
						<p
							aria-label="Memuat ulasan"
							className="label-data text-ink-soft"
							role="status"
						>
							Memuat ulasan
						</p>
					)}
				</div>
				<div
					className="rise lg:sticky lg:top-8"
					style={{ '--rise-delay': '140ms' } as React.CSSProperties}
				>
					<ReviewForm gameId={gameId} />
				</div>
			</div>
		</div>
	)
}
