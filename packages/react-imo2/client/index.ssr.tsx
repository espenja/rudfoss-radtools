import React from "react"
import { renderToString } from "react-dom/server"
import App from "./App"
import { StaticRouter } from "react-router-dom"
import { ISSRProps, TSSR } from "./TSSR"
import { SheetsRegistry, createGenerateId } from "react-jss"

interface ISSRContainerProps extends ISSRProps {
	sheets: SheetsRegistry
	generateId: ReturnType<typeof createGenerateId>
}

const Container: React.FC<ISSRContainerProps> = ({
	context,
	location = "/",
	sheets,
	error
}) => (
	<StaticRouter location={location} context={context}>
		<App error={error} sheets={sheets} />
	</StaticRouter>
)

const render: TSSR = (props) => {
	const sheets = new SheetsRegistry()
	const generateId = createGenerateId()

	const appContent = renderToString(
		<Container {...props} sheets={sheets} generateId={generateId} />
	)

	return {
		appContent,
		context: props.context,
		styleSheet: sheets.toString()
	}
}

export default render
