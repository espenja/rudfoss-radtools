import React, { useState } from "react"
import { concatUrls } from "utilities/generic/concatUrls"
import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
	container: {
		border: "3px solid #f00"
	}
})

export const TestComponent: React.FC = () => {
	const [a, setA] = useState("foo")
	const [b, setB] = useState("bar")
	const classes = useStyles()
	return (
		<div className={classes.container}>
			<input type="text" value={a} onChange={(evt) => setA(evt.target.value)} />
			<br />
			<input type="text" value={b} onChange={(evt) => setB(evt.target.value)} />
			<br />
			<code>{concatUrls([a, b])}</code>
		</div>
	)
}

export default TestComponent
