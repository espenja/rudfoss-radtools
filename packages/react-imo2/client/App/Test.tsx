import React, { useState } from "react"
import { concatUrls } from "utilities/generic/concatUrls"

export const Test: React.FC = () => {
	const [a, setA] = useState("foo")
	const [b, setB] = useState("bar")
	return (
		<>
			<input type="text" value={a} onChange={(evt) => setA(evt.target.value)} />
			<br />
			<input type="text" value={b} onChange={(evt) => setB(evt.target.value)} />
			<br />
			<code>{concatUrls([a, b])}</code>
		</>
	)
}

export default Test
