import type { GameDto } from '@game-review/contracts'
import { Link } from 'react-router-dom'

/** Merangkum informasi pilihan sebuah game tanpa memuat data detail atau ulasan. */
export function GameCard({ game }: { game: GameDto }): React.ReactNode {
	return (
		<article className="flex flex-col rounded-md border border-rule bg-card p-6 transition-colors hover:border-action/40">
			<dl className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-soft">
				<div>
					<dt className="sr-only">Platform</dt>
					<dd className="label-data">{game.platform}</dd>
				</div>
				<span aria-hidden="true" className="text-rule">
					/
				</span>
				<div>
					<dt className="sr-only">Genre</dt>
					<dd className="label-data">{game.genre}</dd>
				</div>
			</dl>
			<h2 className="mt-3 font-display text-2xl font-extrabold text-ink">
				{game.title}
			</h2>
			<p className="mt-2 grow text-[0.9375rem] leading-relaxed text-ink-soft">
				{game.description}
			</p>
			<Link
				aria-label={`Buka detail ${game.title}`}
				className="label-data mt-5 inline-flex items-center gap-1.5 self-start text-action underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
				to={`/games/${game.id}`}
			>
				Lihat detail
				<span aria-hidden="true">&rarr;</span>
			</Link>
		</article>
	)
}
