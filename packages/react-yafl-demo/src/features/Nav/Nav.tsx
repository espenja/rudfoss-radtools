import React from "react"
import { Link } from "react-router-dom"

export const Nav: React.FC = () => {
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/basic-form">Basic form</Link>
				</li>
			</ul>
		</nav>
	)
}

export default Nav
