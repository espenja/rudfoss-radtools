import React from "react"
import App, { IAppProps } from "client/App"
import { SheetsRegistry, JssProvider } from "react-jss"

interface IBootstrapProps extends IAppProps {
	sheetsRegistry?: SheetsRegistry
}

export const Bootstrap: React.FC<IBootstrapProps> = ({
	sheetsRegistry,
	...rest
}) => (
	<JssProvider registry={sheetsRegistry}>
		<App {...rest} />
	</JssProvider>
)

export default Bootstrap
