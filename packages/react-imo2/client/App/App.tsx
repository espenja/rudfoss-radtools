import React from "react"
import Routes from "features/Routes"
import Nav from "features/Nav"
import ErrorCatcher from "client/features/ErrorCatcher"
import { jss } from "react-jss"
import normalizeCSSStyles from "features/GlobalStyles/normalizeCSSStyles"

jss.createStyleSheet(normalizeCSSStyles).attach()

interface IAppProps {
	forceError?: boolean
}

export const App: React.FC<IAppProps> = ({ forceError }) => {
	return (
		<ErrorCatcher force={forceError}>
			<Nav />
			<Routes />
		</ErrorCatcher>
	)
}

export default App
