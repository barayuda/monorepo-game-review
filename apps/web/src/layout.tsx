import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

/** Kerangka responsif bersama agar halaman fokus pada konten tanpa mengulang navigasi dan batas lebar. */
export function AppLayout({ children }: PropsWithChildren): React.ReactNode {
	return (
		<div className="min-h-screen bg-paper text-ink">
			<header className="border-b border-rule bg-card">
				<div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
					<Link
						className="font-display text-lg font-extrabold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-action"
						to="/"
					>
						Game Review
					</Link>
					<span className="label-data text-ink-soft">Ulasan pemain</span>
				</div>
			</header>
			<main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
				{children}
			</main>
		</div>
	)
}
