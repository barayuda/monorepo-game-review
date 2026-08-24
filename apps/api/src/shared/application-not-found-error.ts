export class ApplicationNotFoundError extends Error {
	readonly code = 'NOT_FOUND'

	constructor(resource: string, id: string) {
		super(`${resource} with id '${id}' was not found`)
		this.name = 'ApplicationNotFoundError'
	}
}
