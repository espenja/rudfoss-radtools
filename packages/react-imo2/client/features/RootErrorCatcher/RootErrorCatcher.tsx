import React from "react"
import { RenderableError } from "./RenderableError"

interface IErrorBoundaryProps {
	error?: RenderableError | Error
}

interface IErrorBoundaryState {
	hasError: boolean
}

/**
 * This component serves as a root error catcher for the entire application as well as for
 * rendering any kind of error in place of the content of the page.
 */
export class RootErrorCatcher extends React.PureComponent<
	IErrorBoundaryProps,
	IErrorBoundaryState
> {
	/**
	 * Used during server side rendering to avoid "memory leak warning"
	 */
	private hasError = false

	public state: IErrorBoundaryState = {
		hasError: false
	}

	public componentDidCatch(error: any) {
		console.error(error)
	}

	private renderDefaultError() {
		return this.renderError(RenderableError.newGeneric())
	}
	private renderError(error: RenderableError | Error) {
		const realError =
			error instanceof RenderableError
				? error
				: RenderableError.fromError(error)

		return (
			<div>
				<h1>{realError.title}</h1>
				<p>{realError.message}</p>
				<a href="/">Go back to the home page</a>
			</div>
		)
	}

	public render() {
		if (this.props.error) {
			return this.renderError(this.props.error)
		}
		if (this.state.hasError) {
			return this.renderDefaultError()
		}

		try {
			return this.props.children
		} catch (error) {
			this.hasError = true
			return this.renderError(error)
		}
	}
}

export default RootErrorCatcher
