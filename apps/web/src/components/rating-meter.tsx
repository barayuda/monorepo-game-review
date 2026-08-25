interface RatingMeterProps {
	/** Nama aksesibel lengkap; pemanggil yang menentukan supaya konteksnya tepat. */
	label: string
	size?: 'sm' | 'lg'
	value: number
}

const sizeClass = {
	sm: 'h-6 w-6 text-[0.8125rem]',
	lg: 'h-9 w-9 text-lg',
} as const

/**
 * Meter rating lima segmen, satu-satunya perangkat visual untuk menyatakan nilai
 * di seluruh aplikasi. Bentuknya sama baik saat menampilkan ulasan tunggal
 * maupun rata-rata, sehingga pembaca cukup belajar membacanya sekali.
 */
export function RatingMeter({
	label,
	size = 'sm',
	value,
}: RatingMeterProps): React.ReactNode {
	const filled = Math.round(value)

	return (
		<span aria-label={label} className="inline-flex gap-0.5" role="img">
			{[1, 2, 3, 4, 5].map((segment) => (
				<span
					aria-hidden="true"
					className={`flex items-center justify-center rounded-sm border ${sizeClass[size]} ${
						segment <= filled
							? 'border-verdict bg-verdict/12 text-verdict'
							: 'border-rule bg-paper text-rule'
					}`}
					key={segment}
				>
					★
				</span>
			))}
		</span>
	)
}
