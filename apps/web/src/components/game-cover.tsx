import { useState } from 'react'

interface GameCoverProps {
	/** URL sampul dari katalog; boleh kosong karena field-nya opsional di DTO. */
	imageUrl?: string
	/** Judul game, dipakai membentuk inisial pada penanda cadangan. */
	title: string
	/** `card` untuk kartu katalog, `hero` untuk kepala halaman detail. */
	variant?: 'card' | 'hero'
}

/**
 * Menampilkan sampul game, dengan satu penanda cadangan untuk dua kondisi yang
 * berbeda: game yang memang tidak punya sampul, dan sampul yang gagal dimuat.
 *
 * Host sampul berada di luar kendali aplikasi ini, jadi kegagalan jaringan
 * ditangani di sini alih-alih dibiarkan menjadi ikon gambar rusak.
 *
 * Gambarnya dekoratif: judul game selalu berdampingan sebagai teks, sehingga
 * `alt` sengaja dikosongkan agar pembaca layar tidak menyebut game yang sama
 * dua kali berturut-turut.
 */
export function GameCover({
	imageUrl,
	title,
	variant = 'card',
}: GameCoverProps): React.ReactNode {
	const [failedToLoad, setFailedToLoad] = useState(false)
	const frame = variant === 'hero' ? 'w-32 shrink-0 sm:w-44' : 'w-full'

	return (
		<div
			className={`${frame} relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-sm border border-rule bg-paper`}
		>
			{imageUrl && !failedToLoad ? (
				<img
					alt=""
					className="h-full w-full object-contain"
					decoding="async"
					loading="lazy"
					onError={() => setFailedToLoad(true)}
					src={imageUrl}
				/>
			) : (
				<span
					aria-hidden="true"
					className="font-display text-4xl font-bold text-ink-soft/35"
				>
					{title.slice(0, 1).toUpperCase()}
				</span>
			)}
		</div>
	)
}
