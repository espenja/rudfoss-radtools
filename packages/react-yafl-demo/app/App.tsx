import React from "react"
import GlobalStyles from "features/GlobalStyles"
import { BrowserRouter as Router } from "react-router-dom"
import Layout from "features/Layout"

export const App: React.FC = () => (
	<>
		<GlobalStyles />
		<Router>
			<Layout />
		</Router>
	</>
)

export default App
