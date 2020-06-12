import React from "react"
import { hot } from "react-hot-loader/root"
import { render, hydrate } from "react-dom"
import Bootstrap from "./Bootstrap"
import { BrowserRouter } from "react-router-dom"

const Container: React.FC = () => {
	const Root = hot(Bootstrap)
	const state: any = JSON.parse(
		decodeURIComponent(document.getElementById("appstate")?.innerHTML || "{}")
	)
	return (
		<BrowserRouter>
			<Root state={state} />
		</BrowserRouter>
	)
}

const container = document.getElementById("app")
if (!container) {
	throw new Error(
		"Unable to locate div#app. Make sure the HTML is properly formatted"
	)
}
if (container && container.children.length > 0) {
	hydrate(<Container />, container)
} else {
	render(<Container />, container)
}
