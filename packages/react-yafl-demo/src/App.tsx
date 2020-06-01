import React from "react"
import GlobalStyles from "features/styles/GlobalStyles"

declare global {
	interface Window {
		app: App
	}
}

export class App extends React.PureComponent<any> {
	public constructor(props: any) {
		super(props)
		window.app = this
	}

	public render() {
		return (
			<>
				<GlobalStyles />
				<div>
					<h1>Hello world</h1>
				</div>
			</>
		)
	}
}

export default App
