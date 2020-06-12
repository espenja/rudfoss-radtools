import React from "react"
import { ThemeProvider } from "react-jss"
import muiTheme from "./muiTheme"

const theme = {
	myTheme: {
		color: "#fcc"
	},

	...muiTheme
}

export const Theme: React.FC = ({ children }) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default Theme
