import React from "react"
import App, { IAppProps } from "client/App"
import { SheetsRegistry, JssProvider, createGenerateId } from "react-jss"

interface IBootstrapProps extends IAppProps {
	sheetsRegistry?: SheetsRegistry
	generateId?: ReturnType<typeof createGenerateId>
}

export const Bootstrap: React.FC<IBootstrapProps> = ({
	sheetsRegistry,
	generateId,
	...rest
}) => {
	return (
		<JssProvider registry={sheetsRegistry} generateId={generateId}>
			<App {...rest} />
		</JssProvider>
	)
}

export default Bootstrap
