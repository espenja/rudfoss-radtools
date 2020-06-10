import React from "react"
import { renderToString } from "react-dom/server"
import App from "./App"
import { StaticRouter } from "react-router-dom"
import { ISSRProps, TSSR } from "server/TSSR"
import { JssProvider } from "react-jss"

const Container: React.FC<ISSRProps> = ({
	context,
	location = "/",
	sheets,
	generateId,
	serverError,
	clientError
}) => (
	<JssProvider registry={sheets} generateId={generateId}>
		<StaticRouter location={location} context={context}>
			<App forceError={serverError || clientError} />
		</StaticRouter>
	</JssProvider>
)

const render: TSSR = (props) => renderToString(<Container {...props} />)

export default render
