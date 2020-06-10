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
					<Link to="/async">Async</Link>
				</li>
				<li>
					<Link to="/async2">Async2</Link>
				</li>
				<li>
					<Link to="/missingroute">Missing route</Link>
				</li>
			</ul>
		</nav>
	)
}

export default Nav
