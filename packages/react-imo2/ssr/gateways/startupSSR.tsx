import React from "react"
import Bootstrap from "./Bootstrap"
import { renderToString } from "react-dom/server"
import { SheetsRegistry, createGenerateId } from "react-jss"
import { StaticRouterContext, StaticRouter } from "react-router"
import { ServerStyleSheets } from "@material-ui/core/styles"

export interface ISSRRenderProps {
	url: string
	state: any
}

interface IContainerProps {
	url: string
	context: StaticRouterContext
	sheetsRegistry: SheetsRegistry
	generateId: ReturnType<typeof createGenerateId>
	state: any
}

const Container: React.FC<IContainerProps> = ({
	url,
	context,
	sheetsRegistry,
	generateId,
	state
}) => (
	<StaticRouter location={url} context={context}>
		<Bootstrap
			sheetsRegistry={sheetsRegistry}
			state={state}
			generateId={generateId}
		/>
	</StaticRouter>
)

const render = (props: ISSRRenderProps) => {
	const sheetsRegistry = new SheetsRegistry()
	const generateId = createGenerateId()
	const context: StaticRouterContext = {}
	const muiStyles = new ServerStyleSheets()

	const appContent = renderToString(
		muiStyles.collect(
			<Container
				url={props.url}
				sheetsRegistry={sheetsRegistry}
				context={context}
				state={props.state}
				generateId={generateId}
			/>
		)
	)

	return {
		appContent,
		context,
		styles: muiStyles.toString() + sheetsRegistry.toString()
	}
}

export default render
