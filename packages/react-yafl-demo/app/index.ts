import { hot } from "react-hot-loader/root"
import { createElement } from "react"
import { render } from "react-dom"
import App from "./App"

render(createElement(hot(App)), document.getElementById("app"))
