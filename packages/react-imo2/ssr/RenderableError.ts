export interface IRenderableError {
	title: string
	message: string
	innerError?: {
		name: string
		message: string
		stack?: string
	}
}

/**
 * An error object that can be rendered on the client page.
 */
export class RenderableError extends Error {
	public get stack() {
		return this.innerError?.stack
	}

	public constructor(
		public title: string,
		public message: string,
		public innerError?: Error
	) {
		super(message)
	}

	public static serialize(renderableError: RenderableError): IRenderableError {
		return {
			title: renderableError.title,
			message: renderableError.message,
			innerError: renderableError.innerError
				? {
						name: renderableError.innerError.name,
						stack: renderableError.innerError.stack,
						message: renderableError.innerError.message
				  }
				: undefined
		}
	}
	public static deserialize(serializedRenderableError: IRenderableError) {
		const innerError = serializedRenderableError.innerError
			? new Error(serializedRenderableError.innerError.message)
			: undefined
		if (serializedRenderableError.innerError && innerError) {
			innerError.name = serializedRenderableError.innerError.name
			innerError.message = serializedRenderableError.innerError.message
			innerError.stack = serializedRenderableError.innerError.stack
		}

		return new RenderableError(
			serializedRenderableError.title,
			serializedRenderableError.message,
			innerError
		)
	}

	public static fromError(error: Error) {
		return new RenderableError(error.name, error.message, error)
	}
	public static newGeneric() {
		return new RenderableError("An error has occurred", "An error has occurred")
	}
}
