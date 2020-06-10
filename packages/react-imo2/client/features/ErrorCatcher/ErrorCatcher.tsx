import React from "react"

interface IErrorBoundaryProps {
	force?: boolean
	onError?: React.ElementType
}

interface IErrorBoundaryState {
	hasError: boolean
}

export class ErrorCatcher extends React.PureComponent<
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

	private renderError() {
		return <p>An error occured in this section. See console for details.</p>
	}

	public render() {
		if (this.state.hasError || this.props.force) {
			return this.renderError()
		}

		return this.props.children
	}
}

export default ErrorCatcher
