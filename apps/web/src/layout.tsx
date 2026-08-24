import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

/** Kerangka responsif bersama agar halaman fokus pada konten tanpa mengulang navigasi dan batas lebar. */
export function AppLayout({ children }: PropsWithChildren): React.ReactNode {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<header className="border-b border-slate-800 bg-slate-900/80">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
					<Link
						className="text-lg font-bold tracking-tight text-teal-300"
						to="/"
					>
						Game Review
					</Link>
					<span className="text-sm text-slate-400">Temukan ulasan pemain</span>
				</div>
			</header>
			<main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
				{children}
			</main>
		</div>
	)
}
