import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import TestComponent from "features/TestComponent"
import AsyncTest from "features/AsyncTest"

export const Routes: React.FC = () => (
	<Switch>
		<Route path="/" exact>
			<TestComponent />
		</Route>
		<Route path="/async">
			<AsyncTest />
		</Route>
		<Route path="/async2">
			<Redirect to="/async" />
		</Route>
	</Switch>
)

export default Routes
