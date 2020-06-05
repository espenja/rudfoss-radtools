import { createElement } from "react"
import { renderToNodeStream } from "react-dom/server"
import App from "client/App"

export const render = () => renderToNodeStream(createElement(App))
