interface AwardBadgeProps {
	rank: number
	year: number
}

/**
 * Menandai posisi sebuah game pada daftar Game of the Year tahun tertentu.
 * Rank 1 adalah pemenang; 2 dan 3 adalah nominasi tahun yang sama, karena
 * The Game Awards tidak mengumumkan juara dua dan tiga.
 */
export function AwardBadge({ rank, year }: AwardBadgeProps): React.ReactNode {
	const placement = rank === 1 ? 'Pemenang' : 'Nominasi'

	return (
		<span
			className="label-data inline-flex items-center gap-1.5 rounded-sm border border-verdict/35 bg-verdict/8 px-2 py-1 text-verdict"
			title={`${placement} Game of the Year ${year}`}
		>
			<span aria-hidden="true">★</span>
			GOTY {year} · #{rank}
			<span className="sr-only">, {placement}</span>
		</span>
	)
}
