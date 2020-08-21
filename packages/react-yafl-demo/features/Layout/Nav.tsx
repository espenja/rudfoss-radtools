import React from "react"
import { Link } from "react-router-dom"

export const Nav: React.FC = () => (
	<nav>
		<ul>
			<li>
				<Link to="/">Home</Link>
			</li>
			<li>
				<Link to="/form/spa">Single Page Form</Link>
			</li>
		</ul>
	</nav>
)

export default Nav
