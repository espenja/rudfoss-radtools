import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import NotFound from "../NotFound"
import Thrower from "../Thrower"
import Textbox from "test-ui"
import StyledComponent from "features/StyledComponent"

export const Routes: React.FC = () => (
	<Switch>
		<Route path="/" exact>
			<p>Welcome</p>
		</Route>
		<Route path="/styled">
			<StyledComponent />
		</Route>
		<Route path="/async2">
			<Redirect to="/async" />
		</Route>
		<Route path="/throw">
			<Thrower />
		</Route>
		<Route path="/ui">
			<Textbox />
		</Route>

		<Route
			render={(routeComponentProps) => <NotFound {...routeComponentProps} />}
		/>
	</Switch>
)

export default Routes
