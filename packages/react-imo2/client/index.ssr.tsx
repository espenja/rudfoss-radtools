import React from "react"
import { renderToNodeStream } from "react-dom/server"
import App from "./App"
import { StaticRouter } from "react-router-dom"
import { ISSRProps, TSSR } from "server/TSSR"

const Container: React.FC<ISSRProps> = ({ context, location = "/" }) => (
	<StaticRouter location={location} context={context}>
		<App />
	</StaticRouter>
)

const render: TSSR = (props) => renderToNodeStream(<Container {...props} />)

export default render
