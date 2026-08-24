/**
 * Menandai resource yang tidak ditemukan pada batas aplikasi sehingga caller
 * dapat membedakannya dari kegagalan infrastruktur atau validasi.
 */
export class ApplicationNotFoundError extends Error {
	readonly code = 'NOT_FOUND'

	constructor(resource: string, id: string) {
		super(`${resource} with id '${id}' was not found`)
		this.name = 'ApplicationNotFoundError'
	}
}
