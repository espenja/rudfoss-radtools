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
	public state: IErrorBoundaryState = {
		hasError: false
	}

	public static getDerivedStateFromError() {
		return { hasError: true }
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
			this.renderError(this.props.error)
		}
		if (this.state.hasError) {
			this.renderDefaultError()
		}

		try {
			return this.props.children
		} catch (error) {
			return this.renderError(error)
		}
	}
}

export default RootErrorCatcher
