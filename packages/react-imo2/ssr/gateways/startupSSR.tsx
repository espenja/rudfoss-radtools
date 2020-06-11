import React from "react"
import Bootstrap from "./Bootstrap"
import { renderToString } from "react-dom/server"
import { SheetsRegistry } from "react-jss"
import { StaticRouterContext, StaticRouter } from "react-router"

export interface ISSRRenderProps {
	url: string
	state: any
}

interface IContainerProps {
	url: string
	context: StaticRouterContext
	sheetsRegistry: SheetsRegistry
	state: any
}

const Container: React.FC<IContainerProps> = ({
	url,
	context,
	sheetsRegistry,
	state
}) => (
	<StaticRouter location={url} context={context}>
		<Bootstrap sheetsRegistry={sheetsRegistry} state={state} />
	</StaticRouter>
)

const render = (props: ISSRRenderProps) => {
	const sheetsRegistry = new SheetsRegistry()
	const context: StaticRouterContext = {}

	const appContent = renderToString(
		<Container
			url={props.url}
			sheetsRegistry={sheetsRegistry}
			context={context}
			state={props.state}
		/>
	)
	return {
		appContent,
		context,
		styles: sheetsRegistry.toString()
	}
}

export default render
