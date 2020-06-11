import React from "react"
import { IRenderableError, RenderableError } from "ssr/RenderableError"
import { withRouter, RouteComponentProps } from "react-router-dom"

interface IErrorBoundaryProps extends RouteComponentProps {
	error?: IRenderableError
}

interface IErrorBoundaryState {
	error?: RenderableError
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

	public state: IErrorBoundaryState = {}

	public static getDerivedStateFromError(error?: Error) {
		return {
			error: error
				? RenderableError.fromError(error)
				: RenderableError.newGeneric()
		}
	}

	public componentDidCatch(error: any) {
		console.error(error)
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
			return this.renderError(RenderableError.deserialize(this.props.error))
		}
		if (this.state.error) {
			return this.renderError(this.state.error)
		}

		try {
			return this.props.children
		} catch (error) {
			this.hasError = true
			return this.renderError(error)
		}
	}
}

export default withRouter(RootErrorCatcher)
