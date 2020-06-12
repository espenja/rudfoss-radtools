import React from "react"
import TextField from "@material-ui/core/TextField"

export const Textbox: React.FC = () => {
	const [value, setValue] = React.useState("")
	return (
		<TextField
			value={value}
			onChange={(evt) => setValue(evt.target.value)}
			variant="outlined"
			label="From UI"
		/>
	)
}

export default Textbox
