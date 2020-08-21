import React from "react"
import { Link, Route, Switch } from "react-router-dom"
import SinglePageForm from "react-yafl-demo/features/SinglePageForm"

export const RootRouter: React.FC = () => (
	<Switch>
		<Route path="/" exact></Route>
		<Route path="/form/spa">
			<SinglePageForm />
		</Route>
		<Route>
			<h1>404: Not found</h1>
			<p>
				<Link to="/">Home</Link>
			</p>
		</Route>
	</Switch>
)

export default RootRouter
