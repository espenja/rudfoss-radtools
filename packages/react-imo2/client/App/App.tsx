import React from "react"
import Routes from "features/Routes"
import Nav from "features/Nav"
import RootErrorCatcher from "features/RootErrorCatcher"
import { RenderableError } from "client/features/RootErrorCatcher/RenderableError"

export interface IAppProps {
	error?: RenderableError | Error
}

export const App: React.FC<IAppProps> = ({ error }) => {
	return (
		<RootErrorCatcher error={error}>
			<Nav />
			<Routes />
		</RootErrorCatcher>
	)
}

export default App
