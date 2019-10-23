/**
 * A wrapper error object containing whatever error occurred inside the placeholder handler.
 */
export class PlaceholderError extends Error {
	/**
	 * Wraps a generic error in a PlaceholderError and transfers the message and stack to the outer error.
	 * @param error
	 * @param message An optional message that overrides the wrapped error message.
	 */
	public static Wrap(error: Error, message?: string) {
		return new PlaceholderError(message || error.message, error)
	}

	public constructor(message: string, innerError?: Error) {
		super(message)
		if (innerError) {
			this.stack = innerError.stack
		}
	}
}
export default PlaceholderError
