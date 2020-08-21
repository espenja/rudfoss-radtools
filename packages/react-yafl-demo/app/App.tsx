import React from "react"
import GlobalStyles from "features/styles/GlobalStyles"
import { BrowserRouter as Router } from "react-router-dom"
import Routes from "features/routes"
import Nav from "features/Nav"

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
				<Router>
					<Nav />
					<Routes />
				</Router>
			</>
		)
	}
}

export default App
