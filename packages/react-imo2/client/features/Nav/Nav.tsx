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
					<Link to="/styled">Styled</Link>
				</li>
				<li>
					<Link to="/ui">UI</Link>
				</li>
				<li>
					<Link to="/throw">Test Throw</Link>
				</li>
				<li>
					<Link to="/missingroute">Missing route</Link>
				</li>
			</ul>
		</nav>
	)
}

export default Nav
