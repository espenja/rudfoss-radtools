import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import TestComponent from "features/TestComponent"
import AsyncTest from "features/AsyncTest"
import NotFound from "../NotFound"
import Thrower from "../Thrower"

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
		<Route path="/throw">
			<Thrower />
		</Route>

		<Route
			render={(routeComponentProps) => <NotFound {...routeComponentProps} />}
		/>
	</Switch>
)

export default Routes
