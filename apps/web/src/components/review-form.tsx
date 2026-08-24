import { useState, type FormEvent } from 'react'

import { RatingInput } from './rating-input.js'
import { useCreateReviewMutation } from '../queries/review-queries.js'

interface ReviewFormProps {
	gameId: string
}

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
			className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6"
		>
			<h2 className="text-2xl font-bold" id="review-form-title">
				Tulis ulasan
			</h2>
			<form className="mt-5 space-y-5" noValidate onSubmit={handleSubmit}>
				<div className="space-y-2">
					<label
						className="block text-sm font-semibold"
						htmlFor="reviewer-name"
					>
						Nama reviewer
					</label>
					<input
						aria-describedby={
							reviewerNameError ? 'reviewer-name-error' : undefined
						}
						aria-invalid={reviewerNameError ? true : undefined}
						className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus-visible:border-teal-300 focus-visible:ring-2 focus-visible:ring-teal-300/30 aria-invalid:border-rose-400"
						id="reviewer-name"
						onChange={(event) => {
							setReviewerName(event.target.value)
							setReviewerNameError(undefined)
						}}
						value={reviewerName}
					/>
					{reviewerNameError ? (
						<p className="text-sm text-rose-300" id="reviewer-name-error">
							{reviewerNameError}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label className="block text-sm font-semibold" htmlFor="review-text">
						Teks ulasan
					</label>
					<textarea
						aria-describedby={textError ? 'review-text-error' : undefined}
						aria-invalid={textError ? true : undefined}
						className="min-h-28 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus-visible:border-teal-300 focus-visible:ring-2 focus-visible:ring-teal-300/30 aria-invalid:border-rose-400"
						id="review-text"
						onChange={(event) => {
							setText(event.target.value)
							setTextError(undefined)
						}}
						value={text}
					/>
					{textError ? (
						<p className="text-sm text-rose-300" id="review-text-error">
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
						className="rounded-lg bg-rose-950/60 p-3 text-rose-200"
						role="alert"
					>
						{createReviewMutation.error instanceof Error
							? createReviewMutation.error.message
							: 'Ulasan gagal disimpan. Coba lagi.'}
					</p>
				) : null}
				<button
					className="rounded-lg bg-teal-300 px-4 py-2 font-semibold text-slate-950 hover:bg-teal-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
					disabled={createReviewMutation.isPending}
					type="submit"
				>
					{createReviewMutation.isPending ? 'Mengirim ulasan' : 'Kirim ulasan'}
				</button>
			</form>
		</section>
	)
}
