import type { GameDto } from '@game-review/contracts'
import { Link } from 'react-router-dom'

import { AwardBadge } from './award-badge.js'

interface GameCardProps {
	game: GameDto
	/** Urutan kartu, dipakai menunda animasi masuk agar grid terbuka berurutan. */
	index?: number
}

/** Merangkum informasi pilihan sebuah game tanpa memuat data detail atau ulasan. */
export function GameCard({ game, index = 0 }: GameCardProps): React.ReactNode {
	return (
		<article
			className="rise group flex flex-col rounded-md border border-rule bg-card p-6 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/50 hover:shadow-[0_12px_28px_-18px_rgb(13_17_23/0.45)]"
			style={{ '--rise-delay': `${index * 70}ms` } as React.CSSProperties}
		>
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
			<h2 className="mt-3 font-display text-2xl font-bold text-ink">
				{game.title}
			</h2>
			<dl className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
				<div>
					<dt className="sr-only">Developer</dt>
					<dd>{game.developer}</dd>
				</div>
				<span aria-hidden="true" className="text-rule">
					·
				</span>
				<div>
					<dt className="sr-only">Tahun rilis</dt>
					<dd>{game.releaseYear}</dd>
				</div>
			</dl>
			<p className="prose-review mt-3 grow text-ink-soft">{game.description}</p>
			{game.awardYear && game.awardRank ? (
				<div className="mt-4">
					<AwardBadge rank={game.awardRank} year={game.awardYear} />
				</div>
			) : null}
			<Link
				aria-label={`Buka detail ${game.title}`}
				className="label-data mt-5 -mb-2 inline-flex items-center gap-1.5 self-start py-2 text-action underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
				to={`/games/${game.id}`}
			>
				Lihat detail
				<span
					aria-hidden="true"
					className="transition-transform duration-200 group-hover:translate-x-1"
				>
					&rarr;
				</span>
			</Link>
		</article>
	)
}
