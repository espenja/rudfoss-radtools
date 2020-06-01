import React from "react"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
	"@global": {
		body: {
			fontSize: 14
		}
	}
})

export const GlobalStyles: React.FC = () => {
	useStyles()
	return null
}

export default GlobalStyles
