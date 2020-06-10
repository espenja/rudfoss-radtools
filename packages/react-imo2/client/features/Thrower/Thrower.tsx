import React, { useState } from "react"

const throwErr = () => {
	throw new Error("Foo")
}

export const Thrower: React.FC = () => {
	const [doThrow, setDoThrow] = useState(false)
	return <button onClick={(evt) => setDoThrow(true)}>{throwErr()}</button>
}

export default Thrower
