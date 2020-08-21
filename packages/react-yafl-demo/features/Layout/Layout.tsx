import React from "react"
import GlobalStyles from "features/GlobalStyles"
import Nav from "./Nav"
import RootRouter from "./RootRouter"

export const Layout: React.FC = () => (
	<>
		<GlobalStyles />
		<Nav />
		<RootRouter />
	</>
)

export default Layout
