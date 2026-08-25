import type { ReviewDto } from '@game-review/contracts'

import { RatingMeter } from './rating-meter.js'

interface ReviewListProps {
	reviews: ReviewDto[]
}

/** Merender ulasan server secara semantik agar nama, isi, dan rating mudah dipindai pembaca. */
export function ReviewList({ reviews }: ReviewListProps): React.ReactNode {
	if (reviews.length === 0) {
		return (
			<p className="prose-review rounded-md border border-dashed border-rule bg-card/60 p-6 text-ink-soft">
				Belum ada ulasan untuk game ini.
			</p>
		)
	}

	return (
		<ul className="space-y-3">
			{reviews.map((review) => (
				<li
					className="rise rounded-md border border-rule bg-card p-5"
					key={review.id}
				>
					<div className="flex flex-wrap items-start justify-between gap-3">
						<p className="font-semibold text-ink">{review.reviewerName}</p>
						<RatingMeter
							label={`Rating ${review.rating} dari 5`}
							value={review.rating}
						/>
					</div>
					<p className="prose-review mt-3 text-ink">{review.text}</p>
				</li>
			))}
		</ul>
	)
}
