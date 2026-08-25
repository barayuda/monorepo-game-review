import { useState, type FormEvent } from 'react'

import { RatingInput } from './rating-input.js'
import { useCreateReviewMutation } from '../queries/review-queries.js'

interface ReviewFormProps {
	gameId: string
}

const fieldClass =
	'w-full rounded-sm border border-rule bg-card px-3 py-2.5 text-ink outline-none placeholder:text-rule focus-visible:border-action focus-visible:ring-2 focus-visible:ring-action/20 aria-invalid:border-danger'

/** Menjaga field ulasan sebagai state lokal dan mendelegasikan server-state ke mutation query. */
export function ReviewForm({ gameId }: ReviewFormProps): React.ReactNode {
	const [reviewerName, setReviewerName] = useState('')
	const [text, setText] = useState('')
	const [rating, setRating] = useState<number | null>(null)
	const [reviewerNameError, setReviewerNameError] = useState<string>()
	const [textError, setTextError] = useState<string>()
	const [ratingError, setRatingError] = useState<string>()
	const createReviewMutation = useCreateReviewMutation(gameId)

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault()

		const normalizedReviewerName = reviewerName.trim()
		const normalizedText = text.trim()

		if (!normalizedReviewerName) {
			setReviewerNameError('Nama reviewer wajib diisi.')
		}

		if (!normalizedText) {
			setTextError('Teks ulasan wajib diisi.')
		}

		if (rating === null) {
			setRatingError('Pilih rating 1 sampai 5.')
		}

		if (!normalizedReviewerName || !normalizedText || rating === null) {
			return
		}

		createReviewMutation.mutate(
			{
				reviewerName: normalizedReviewerName,
				text: normalizedText,
				rating,
			},
			{
				onSuccess: () => {
					setReviewerName('')
					setText('')
					setRating(null)
				},
			},
		)
	}

	return (
		<section
			aria-labelledby="review-form-title"
			className="rounded-md border border-rule bg-card p-6"
		>
			<h2
				className="font-display text-xl font-bold text-ink"
				id="review-form-title"
			>
				Tulis ulasan
			</h2>
			<p className="mt-1.5 text-sm text-ink-soft">
				Ulasanmu langsung terlihat pemain lain.
			</p>
			<form className="mt-5 space-y-5" noValidate onSubmit={handleSubmit}>
				<div className="space-y-2">
					<label
						className="label-data block text-ink-soft"
						htmlFor="reviewer-name"
					>
						Nama reviewer
					</label>
					<input
						aria-describedby={
							reviewerNameError ? 'reviewer-name-error' : undefined
						}
						aria-invalid={reviewerNameError ? true : undefined}
						className={fieldClass}
						id="reviewer-name"
						onChange={(event) => {
							setReviewerName(event.target.value)
							setReviewerNameError(undefined)
						}}
						value={reviewerName}
					/>
					{reviewerNameError ? (
						<p
							className="text-sm text-danger"
							id="reviewer-name-error"
							role="alert"
						>
							{reviewerNameError}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label
						className="label-data block text-ink-soft"
						htmlFor="review-text"
					>
						Teks ulasan
					</label>
					<textarea
						aria-describedby={textError ? 'review-text-error' : undefined}
						aria-invalid={textError ? true : undefined}
						className={`${fieldClass} min-h-28 leading-relaxed`}
						id="review-text"
						onChange={(event) => {
							setText(event.target.value)
							setTextError(undefined)
						}}
						value={text}
					/>
					{textError ? (
						<p
							className="text-sm text-danger"
							id="review-text-error"
							role="alert"
						>
							{textError}
						</p>
					) : null}
				</div>
				<RatingInput
					error={ratingError}
					onChange={(nextRating) => {
						setRating(nextRating)
						setRatingError(undefined)
					}}
					value={rating}
				/>
				{createReviewMutation.isError ? (
					<p
						className="rounded-sm border border-danger/30 bg-danger/8 p-3 text-sm text-danger"
						role="alert"
					>
						{createReviewMutation.error instanceof Error
							? createReviewMutation.error.message
							: 'Ulasan gagal disimpan. Coba lagi.'}
					</p>
				) : null}
				<button
					className="label-field w-full rounded-sm bg-action px-4 py-3.5 text-card transition-colors hover:bg-action-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action disabled:opacity-60"
					disabled={createReviewMutation.isPending}
					type="submit"
				>
					{createReviewMutation.isPending ? 'Mengirim ulasan' : 'Kirim ulasan'}
				</button>
			</form>
		</section>
	)
}
