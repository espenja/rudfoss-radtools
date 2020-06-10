import React from "react"
import { renderToString } from "react-dom/server"
import App from "./App"
import { StaticRouter } from "react-router-dom"
import { ISSRProps, TSSR } from "server/TSSR"

const Container: React.FC<ISSRProps> = ({
	context,
	location = "/",
	forceError
}) => (
	<StaticRouter location={location} context={context}>
		<App forceError={forceError} />
	</StaticRouter>
)

const render: TSSR = (props) => renderToString(<Container {...props} />)

export default render
