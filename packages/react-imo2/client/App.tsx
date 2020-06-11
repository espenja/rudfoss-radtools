import React from "react"
import Routes from "features/Routes"
import Nav from "features/Nav"
import RootErrorCatcher from "features/RootErrorCatcher"
import { createUseStyles } from "react-jss"
import normalizeCSSStyles from "./normalizeCSSStyles"

const useStyles = createUseStyles(normalizeCSSStyles)

export interface IAppProps {
	state?: any
}

export const App: React.FC<IAppProps> = ({ state }) => {
	useStyles()
	return (
		<RootErrorCatcher>
			<Nav />
			<Routes />
			<pre>
				<code>{`State
${JSON.stringify(state, null, 2)}`}</code>
			</pre>
		</RootErrorCatcher>
	)
}

export default App
