import React from "react"
import { Switch, Route } from "react-router-dom"
import BasicForm from "features/BasicForm"

export const Routes: React.FC = () => {
	return (
		<Switch>
			<Route path="/" exact>
				<h1>Home</h1>
			</Route>
			<Route path="/">
				<BasicForm />
			</Route>
		</Switch>
	)
}

export default Routes
