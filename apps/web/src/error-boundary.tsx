import { Component, type ErrorInfo, type PropsWithChildren } from 'react'

interface ErrorBoundaryState {
	hasError: boolean
}

/**
 * Menahan kegagalan render agar aplikasi tidak berubah menjadi halaman putih.
 *
 * Masih berupa class component karena React belum menyediakan padanan hook untuk
 * error boundary. Router memakai mode deklaratif tanpa `errorElement`, jadi tanpa
 * batas ini satu lemparan saat render akan mengosongkan seluruh layar.
 */
export class ErrorBoundary extends Component<
	PropsWithChildren,
	ErrorBoundaryState
> {
	override state: ErrorBoundaryState = { hasError: false }

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true }
	}

	override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Tanpa pelaporan terpusat, console adalah satu-satunya jejak yang tersisa.
		console.error('Render gagal', error, errorInfo)
	}

	override render(): React.ReactNode {
		if (!this.state.hasError) {
			return this.props.children
		}

		return (
			<section className="max-w-xl space-y-4" role="alert">
				<h1 className="font-display text-3xl font-bold">
					Halaman gagal ditampilkan
				</h1>
				<p className="text-ink-soft">
					Terjadi kesalahan yang tidak terduga saat menampilkan halaman ini.
				</p>
				<button
					className="label-field rounded-sm bg-action px-4 py-3 text-card transition-colors hover:bg-action-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
					onClick={() => this.setState({ hasError: false })}
					type="button"
				>
					Coba lagi
				</button>
			</section>
		)
	}
}
