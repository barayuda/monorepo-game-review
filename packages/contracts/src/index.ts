/**
 * DTO publik sebuah game yang dikirim API tanpa mengekspos detail persistence.
 *
 * `awardYear` dan `awardRank` hanya ada pada game yang masuk daftar Game of the
 * Year. Rank 1 berarti pemenang tahun itu; rank 2 dan 3 adalah nominasi pada
 * tahun yang sama, diurutkan oleh katalog ini karena The Game Awards tidak
 * mengumumkan juara dua dan tiga.
 *
 * `imageUrl` opsional: katalog boleh memuat game tanpa sampul, dan client
 * membedakan kondisi itu dari sampul yang gagal dimuat.
 */
export interface GameDto {
	id: string
	title: string
	description: string
	genre: string
	platform: string
	developer: string
	releaseYear: number
	imageUrl?: string
	awardYear?: number
	awardRank?: number
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

/**
 * Envelope kegagalan API yang stabil untuk dikonsumsi semua transport client.
 *
 * `VALIDATION_ERROR` khusus untuk field yang tidak lolos pemeriksaan, sehingga
 * client dapat menempelkannya ke input. Kegagalan request lain di rentang 4xx,
 * seperti media type yang tidak didukung atau body yang terlalu besar, memakai
 * `BAD_REQUEST` dengan status HTTP yang tetap menjelaskan penyebabnya.
 */
export interface ApiErrorDto {
	code:
		| 'NOT_FOUND'
		| 'GAME_NOT_FOUND'
		| 'VALIDATION_ERROR'
		| 'BAD_REQUEST'
		| 'INTERNAL_ERROR'
	message: string
	issues?: ValidationIssueDto[]
}
