/**
 * Menandai input yang melanggar invariant aplikasi agar transport layer dapat
 * memetakan kegagalan validasi secara konsisten, terlepas dari sumber inputnya.
 */
export class ApplicationValidationError extends Error {
	readonly code = 'VALIDATION_ERROR'

	constructor(
		readonly field: string,
		message: string,
	) {
		super(message)
		this.name = 'ApplicationValidationError'
	}
}
