import React from "react"
import Routes from "features/Routes"
import Nav from "features/Nav"

export const App: React.FC = () => {
	return (
		<>
			<Nav />
			<Routes />
		</>
	)
}

export default App
