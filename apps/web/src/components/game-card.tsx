import type { GameDto } from '@game-review/contracts'
import { Link } from 'react-router-dom'

/** Merangkum informasi pilihan sebuah game tanpa memuat data detail atau ulasan. */
export function GameCard({ game }: { game: GameDto }): React.ReactNode {
	return (
		<article className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
			<h2 className="text-xl font-bold tracking-tight text-slate-100">
				{game.title}
			</h2>
			<dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
				<div>
					<dt className="sr-only">Platform</dt>
					<dd>{game.platform}</dd>
				</div>
				<div>
					<dt className="sr-only">Genre</dt>
					<dd>{game.genre}</dd>
				</div>
			</dl>
			<Link
				aria-label={`Buka detail ${game.title}`}
				className="mt-5 inline-flex text-sm font-semibold text-teal-300 hover:text-teal-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
				to={`/games/${game.id}`}
			>
				Lihat detail
			</Link>
		</article>
	)
}
