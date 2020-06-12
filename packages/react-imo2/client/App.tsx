import React from "react"
import Routes from "features/Routes"
import Nav from "features/Nav"
import RootErrorCatcher from "features/RootErrorCatcher"
import { createUseStyles } from "react-jss"
import normalizeCSSStyles from "./normalizeCSSStyles"
import { IAppState } from "./IAppState"
import Theme from "features/Theme"

const useStyles = createUseStyles({
	...normalizeCSSStyles
})

export interface IAppProps {
	state?: IAppState
}

export const App: React.FC<IAppProps> = ({ state }) => {
	useStyles()
	return (
		<Theme>
			<RootErrorCatcher error={state?.error}>
				<Nav />
				<Routes />
				{state?.ssr ? <p>Hello from server</p> : <p>Hello from client</p>}
			</RootErrorCatcher>
		</Theme>
	)
}

export default App
