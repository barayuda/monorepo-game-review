import { useId, useRef, useState, type FormEvent } from 'react'

import { ApiClientError } from '../api/http-client.js'
import { RatingInput } from './rating-input.js'
import { useCreateReviewMutation } from '../queries/review-queries.js'

interface ReviewFormProps {
	gameId: string
}

const fieldClass =
	'w-full rounded-sm border border-rule bg-card px-3 py-2.5 text-ink focus-visible:border-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action aria-invalid:border-danger'

/** Menjaga field ulasan sebagai state lokal dan mendelegasikan server-state ke mutation query. */
export function ReviewForm({ gameId }: ReviewFormProps): React.ReactNode {
	const formId = useId()
	const reviewerNameId = `${formId}-reviewer-name`
	const textId = `${formId}-review-text`
	const reviewerNameErrorId = `${reviewerNameId}-error`
	const textErrorId = `${textId}-error`
	const ratingErrorId = `${formId}-rating-error`

	const reviewerNameRef = useRef<HTMLInputElement>(null)
	const textRef = useRef<HTMLTextAreaElement>(null)
	const ratingRef = useRef<HTMLInputElement>(null)

	const [reviewerName, setReviewerName] = useState('')
	const [text, setText] = useState('')
	const [rating, setRating] = useState<number | null>(null)
	const [reviewerNameError, setReviewerNameError] = useState<string>()
	const [textError, setTextError] = useState<string>()
	const [ratingError, setRatingError] = useState<string>()
	const createReviewMutation = useCreateReviewMutation(gameId)

	/**
	 * Menempelkan kegagalan validasi server ke field yang disebutkan API, supaya
	 * pengguna tahu bagian mana yang harus diperbaiki, bukan hanya bahwa gagal.
	 */
	function applyServerIssues(error: unknown): void {
		if (!(error instanceof ApiClientError) || !error.issues) {
			return
		}

		for (const issue of error.issues) {
			if (issue.path[0] === 'reviewerName') {
				setReviewerNameError(issue.message)
			} else if (issue.path[0] === 'text') {
				setTextError(issue.message)
			} else if (issue.path[0] === 'rating') {
				setRatingError(issue.message)
			}
		}
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault()

		// Pengiriman ganda lewat Enter diabaikan tanpa menonaktifkan tombol, agar fokus keyboard tidak hilang.
		if (createReviewMutation.isPending) {
			return
		}

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
			// Pesan galat saja tidak cukup; fokus harus pindah ke kontrol pertama yang bermasalah.
			if (!normalizedReviewerName) {
				reviewerNameRef.current?.focus()
			} else if (!normalizedText) {
				textRef.current?.focus()
			} else {
				ratingRef.current?.focus()
			}
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
				onError: applyServerIssues,
			},
		)
	}

	return (
		<section
			aria-labelledby={`${formId}-title`}
			className="rounded-md border border-rule bg-card p-6"
		>
			<h2
				className="font-display text-xl font-bold text-ink"
				id={`${formId}-title`}
			>
				Tulis ulasan
			</h2>
			<p className="mt-1.5 text-sm text-ink-soft">
				Ulasanmu langsung terlihat pemain lain.
			</p>
			<form className="mt-5 space-y-5" noValidate onSubmit={handleSubmit}>
				<div className="space-y-2">
					<label
						className="label-field block text-ink"
						htmlFor={reviewerNameId}
					>
						Nama reviewer
					</label>
					<input
						aria-describedby={
							reviewerNameError ? reviewerNameErrorId : undefined
						}
						aria-invalid={reviewerNameError ? true : undefined}
						className={fieldClass}
						id={reviewerNameId}
						maxLength={80}
						onChange={(event) => {
							setReviewerName(event.target.value)
							setReviewerNameError(undefined)
						}}
						ref={reviewerNameRef}
						value={reviewerName}
					/>
					{reviewerNameError ? (
						<p
							className="text-sm text-danger"
							id={reviewerNameErrorId}
							role="alert"
						>
							{reviewerNameError}
						</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label className="label-field block text-ink" htmlFor={textId}>
						Teks ulasan
					</label>
					<textarea
						aria-describedby={textError ? textErrorId : undefined}
						aria-invalid={textError ? true : undefined}
						className={`${fieldClass} min-h-28 leading-relaxed`}
						id={textId}
						maxLength={2000}
						onChange={(event) => {
							setText(event.target.value)
							setTextError(undefined)
						}}
						ref={textRef}
						value={text}
					/>
					{textError ? (
						<p className="text-sm text-danger" id={textErrorId} role="alert">
							{textError}
						</p>
					) : null}
				</div>
				<RatingInput
					error={ratingError}
					errorId={ratingErrorId}
					name={`${formId}-rating`}
					onChange={(nextRating) => {
						setRating(nextRating)
						setRatingError(undefined)
					}}
					ref={ratingRef}
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
					aria-disabled={createReviewMutation.isPending}
					className="label-field w-full rounded-sm bg-action px-4 py-3.5 text-card transition-colors hover:bg-action-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action aria-disabled:opacity-60"
					type="submit"
				>
					{createReviewMutation.isPending ? 'Mengirim ulasan' : 'Kirim ulasan'}
				</button>
			</form>
		</section>
	)
}
