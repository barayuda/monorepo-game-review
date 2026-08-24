import type { ApiErrorDto, ValidationIssueDto } from '@game-review/contracts'

/** Kesalahan transport terstruktur agar UI dapat membedakan respons API dan gangguan jaringan. */
export class ApiClientError extends Error {
	constructor(
		message: string,
		public readonly status: number,
		public readonly code: ApiErrorDto['code'] | 'UNKNOWN_ERROR',
		public readonly issues?: ValidationIssueDto[],
	) {
		super(message)
		this.name = 'ApiClientError'
	}
}

/** Membaca envelope error API dengan fallback aman bila respons tidak mengikuti kontrak. */
async function toApiClientError(response: Response): Promise<ApiClientError> {
	const body = (await response
		.json()
		.catch(() => null)) as Partial<ApiErrorDto> | null

	return new ApiClientError(
		typeof body?.message === 'string'
			? body.message
			: 'Permintaan ke server gagal.',
		response.status,
		typeof body?.code === 'string' ? body.code : 'UNKNOWN_ERROR',
		Array.isArray(body?.issues) ? body.issues : undefined,
	)
}

/** Gerbang tunggal HTTP browser untuk seluruh modul API aplikasi. */
class HttpClient {
	async get<TResponse>(
		path: string,
		init?: Pick<RequestInit, 'signal'>,
	): Promise<TResponse> {
		return this.request<TResponse>(path, init)
	}

	async post<TResponse>(path: string, body: unknown): Promise<TResponse> {
		return this.request<TResponse>(path, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
		})
	}

	private async request<TResponse>(
		path: string,
		init?: RequestInit,
	): Promise<TResponse> {
		const response = await fetch(path, init)

		if (!response.ok) {
			throw await toApiClientError(response)
		}

		return (await response.json()) as TResponse
	}
}

/** Instance HTTP bersama yang memakai path relatif agar proxy lingkungan menangani routing. */
export const httpClient = new HttpClient()
