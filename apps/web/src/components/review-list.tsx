import type { ReviewDto } from '@game-review/contracts'

interface ReviewListProps {
	reviews: ReviewDto[]
}

/** Merender ulasan server secara semantik agar nama, isi, dan rating mudah dipindai pembaca. */
export function ReviewList({ reviews }: ReviewListProps): React.ReactNode {
	if (reviews.length === 0) {
		return (
			<p className="rounded-xl border border-dashed border-slate-700 p-4 text-slate-400">
				Belum ada ulasan untuk game ini.
			</p>
		)
	}

	return (
		<ul className="space-y-3">
			{reviews.map((review) => (
				<li
					className="rounded-xl border border-slate-800 bg-slate-900 p-4"
					key={review.id}
				>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<p className="font-semibold text-slate-100">
							{review.reviewerName}
						</p>
						<span
							aria-label={`Rating ${review.rating} dari 5`}
							className="text-amber-300"
						>
							{'★'.repeat(review.rating)}
						</span>
					</div>
					<p className="mt-2 text-slate-300">{review.text}</p>
				</li>
			))}
		</ul>
	)
}
