import { hot } from "react-hot-loader/root"
import { createElement } from "react"
import { render, hydrate } from "react-dom"
import App from "./App"

const container = document.getElementById("app")
const app = createElement(hot(App))
if (container && container.children.length > 0) {
	hydrate(app, container)
} else {
	render(app, container)
}
