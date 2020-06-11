import React from "react"
import Routes from "features/Routes"
import Nav from "features/Nav"
import RootErrorCatcher from "features/RootErrorCatcher"
import { RenderableError } from "client/features/RootErrorCatcher/RenderableError"
import {
	createUseStyles,
	JssProvider,
	createGenerateId,
	SheetsRegistry
} from "react-jss"
import normalizeCSSStyles from "./normalizeCSSStyles"

const useStyles = createUseStyles(normalizeCSSStyles)

export interface IAppProps {
	error?: RenderableError | Error
	sheets?: SheetsRegistry
}

export const App: React.FC<Omit<IAppProps, "sheets">> = ({ error }) => {
	useStyles()
	return (
		<RootErrorCatcher error={error}>
			<Nav />
			<Routes />
		</RootErrorCatcher>
	)
}

const AppContainer: React.FC<IAppProps> = (props) => {
	const generateId = createGenerateId()
	return (
		<JssProvider
			generateId={generateId}
			registry={props.sheets || new SheetsRegistry()}
		>
			<App {...props} />
		</JssProvider>
	)
}

export default AppContainer
