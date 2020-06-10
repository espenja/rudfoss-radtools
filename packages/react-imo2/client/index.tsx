import React from "react"
import { hot } from "react-hot-loader/root"
import { render, hydrate } from "react-dom"
import App from "./App"
import { BrowserRouter } from "react-router-dom"

const Container: React.FC = () => {
	const Root = hot(App)
	return (
		<BrowserRouter>
			<Root />
		</BrowserRouter>
	)
}

const container = document.getElementById("app")
if (container && container.children.length > 0) {
	hydrate(<Container />, container)
} else {
	render(<Container />, container)
}
