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
			<legend className="text-sm font-semibold text-slate-200">Rating</legend>
			<div className="flex flex-wrap gap-2">
				{[1, 2, 3, 4, 5].map((rating) => (
					<label className="cursor-pointer" key={rating}>
						<input
							checked={value === rating}
							className="peer sr-only"
							name="rating"
							onChange={() => onChange(rating)}
							type="radio"
							value={rating}
						/>
						<span className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-lg text-amber-300 peer-checked:border-amber-300 peer-checked:bg-amber-300/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber-300">
							<span aria-hidden="true">★</span>
							<span className="sr-only">{rating} bintang</span>
						</span>
					</label>
				))}
			</div>
			{error ? (
				<p className="text-sm text-rose-300" id="rating-error">
					{error}
				</p>
			) : null}
		</fieldset>
	)
}
