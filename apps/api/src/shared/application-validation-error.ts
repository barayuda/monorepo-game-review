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
