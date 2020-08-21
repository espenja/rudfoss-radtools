import React from "react"
import { createUseStyles, jss } from "react-jss"
import normalizeCSSStyles from "./normalizeCSSStyles"

jss.createStyleSheet(normalizeCSSStyles as any).attach()

const useStyles = createUseStyles({
	"@global": {
		html: {
			height: "100%"
		},
		body: {
			fontSize: 14,
			height: "100%"
		}
	}
})

export const GlobalStyles: React.FC = () => {
	useStyles()
	return null
}

export default GlobalStyles
