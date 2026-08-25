interface RatingInputProps {
	error?: string
	onChange: (rating: number) => void
	value: number | null
}

/** Kontrol radio native menjaga pilihan rating 1–5 dapat dioperasikan dengan keyboard dan pembaca layar. */
export function RatingInput({
	error,
	onChange,
	value,
}: RatingInputProps): React.ReactNode {
	return (
		<fieldset
			aria-describedby={error ? 'rating-error' : undefined}
			aria-invalid={error ? true : undefined}
			className="space-y-2"
		>
			<legend className="label-field text-ink">Rating</legend>
			<div className="flex flex-wrap gap-1.5">
				{[1, 2, 3, 4, 5].map((rating) => {
					// Mengisi seluruh segmen sampai nilai terpilih agar terbaca sebagai skala, bukan lima tombol lepas.
					const isFilled = value !== null && rating <= value

					return (
						<label className="cursor-pointer" key={rating}>
							<input
								checked={value === rating}
								className="peer sr-only"
								name="rating"
								onChange={() => onChange(rating)}
								type="radio"
								value={rating}
							/>
							<span
								className={`flex h-11 w-11 items-center justify-center rounded-sm border text-lg transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-action ${
									isFilled
										? 'border-verdict bg-verdict/12 text-verdict'
										: 'border-ink-soft/35 bg-card text-ink-soft/45 hover:border-action hover:text-action'
								}`}
							>
								<span aria-hidden="true">★</span>
								<span className="sr-only">{rating} bintang</span>
							</span>
						</label>
					)
				})}
			</div>
			{error ? (
				<p className="text-sm text-danger" id="rating-error" role="alert">
					{error}
				</p>
			) : null}
		</fieldset>
	)
}
