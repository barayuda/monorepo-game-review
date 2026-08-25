import type { ReviewDto } from '@game-review/contracts'

import { RatingMeter } from './rating-meter.js'

interface ReviewSummaryProps {
	reviews: ReviewDto[]
}

/**
 * Menyimpulkan penilaian pemain menjadi satu angka. Dihitung dari ulasan yang
 * sudah ada di cache, jadi tidak menambah request maupun mengubah kontrak REST.
 */
export function ReviewSummary({
	reviews,
}: ReviewSummaryProps): React.ReactNode {
	if (reviews.length === 0) {
		return null
	}

	const average =
		reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
	// Pembaca Indonesia membaca desimal dengan koma.
	const formatted = average.toFixed(1).replace('.', ',')

	return (
		<section
			aria-label="Ringkasan penilaian"
			className="rise flex flex-wrap items-center gap-x-8 gap-y-5 rounded-md border border-rule bg-card px-6 py-5"
		>
			<div className="flex items-center gap-4">
				<p className="font-display text-7xl leading-none font-bold tracking-[-0.05em] tabular-nums">
					{formatted}
				</p>
				<div className="space-y-1.5">
					<p className="label-data text-ink-soft">Rata-rata</p>
					<RatingMeter
						label={`Rata-rata rating ${formatted} dari 5`}
						size="lg"
						value={average}
					/>
				</div>
			</div>
			<p className="label-data border-rule text-ink-soft sm:ml-auto sm:border-l sm:pl-8">
				{reviews.length} ulasan pemain
			</p>
		</section>
	)
}
