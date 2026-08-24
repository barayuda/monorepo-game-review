/** DTO publik sebuah game yang dikirim API tanpa mengekspos detail persistence. */
export interface GameDto {
	id: string
	title: string
	description: string
	genre: string
	platform: string
}

/** DTO publik ulasan yang sudah tersimpan dan ditampilkan untuk sebuah game. */
export interface ReviewDto {
	id: string
	gameId: string
	reviewerName: string
	text: string
	rating: number
	createdAt: string
}

/** Payload publik untuk membuat ulasan sebelum API menerapkan validasi request. */
export interface CreateReviewRequestDto {
	reviewerName: string
	text: string
	rating: number
}

/** DTO status ringan untuk pengecekan kesiapan proses API. */
export interface HealthDto {
	status: 'ok'
}

/** Detail lokasi dan alasan sebuah field request tidak dapat diterima API. */
export interface ValidationIssueDto {
	path: Array<string | number>
	message: string
}

/** Envelope kegagalan API yang stabil untuk dikonsumsi semua transport client. */
export interface ApiErrorDto {
	code: 'NOT_FOUND' | 'GAME_NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
	message: string
	issues?: ValidationIssueDto[]
}
