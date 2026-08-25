import type { Ref } from 'react'

interface RatingInputProps {
	error?: string
	errorId: string
	/** Nama grup radio; unik per formulir agar dua formulir tidak saling mengunci pilihan. */
	name: string
	onChange: (rating: number) => void
	/** Menunjuk radio pertama supaya formulir bisa memindahkan fokus ke sini saat rating belum dipilih. */
	ref?: Ref<HTMLInputElement>
	value: number | null
}

/** Kontrol radio native menjaga pilihan rating 1–5 dapat dioperasikan dengan keyboard dan pembaca layar. */
export function RatingInput({
	error,
	errorId,
	name,
	onChange,
	ref,
	value,
}: RatingInputProps): React.ReactNode {
	return (
		<fieldset className="space-y-2">
			<legend className="label-field text-ink">Rating</legend>
			{/*
			 * `aria-invalid` dan `aria-describedby` dipasang pada radiogroup, bukan pada
			 * fieldset: fieldset memetakan ke role `group` yang tidak mendukung
			 * `aria-invalid`, sehingga statusnya tidak akan diumumkan.
			 */}
			<div
				aria-describedby={error ? errorId : undefined}
				aria-invalid={error ? true : undefined}
				aria-label="Rating"
				className="flex flex-wrap gap-1.5"
				role="radiogroup"
			>
				{[1, 2, 3, 4, 5].map((rating) => {
					// Mengisi seluruh segmen sampai nilai terpilih agar terbaca sebagai skala, bukan lima tombol lepas.
					const isFilled = value !== null && rating <= value

					return (
						<label className="cursor-pointer" key={rating}>
							<input
								checked={value === rating}
								className="peer sr-only"
								name={name}
								onChange={() => onChange(rating)}
								ref={rating === 1 ? ref : undefined}
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
				<p className="text-sm text-danger" id={errorId} role="alert">
					{error}
				</p>
			) : null}
		</fieldset>
	)
}
