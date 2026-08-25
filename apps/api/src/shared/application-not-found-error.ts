/**
 * Menandai resource yang tidak ditemukan pada batas aplikasi sehingga caller
 * dapat membedakannya dari kegagalan infrastruktur atau validasi.
 *
 * `resource` disimpan sebagai field, bukan hanya disisipkan ke pesan, supaya
 * transport layer bisa memetakan setiap jenis resource ke kode error yang tepat
 * alih-alih menganggap semuanya game.
 */
export class ApplicationNotFoundError extends Error {
	constructor(
		readonly resource: string,
		readonly id: string,
	) {
		super(`${resource} with id '${id}' was not found`)
		this.name = 'ApplicationNotFoundError'
	}
}
