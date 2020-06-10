import { createElement } from "react"
import { renderToNodeStream } from "react-dom/server"
import App from "./App"

const render = () => renderToNodeStream(createElement(App))

export default render
