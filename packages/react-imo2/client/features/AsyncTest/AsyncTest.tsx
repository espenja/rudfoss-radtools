import React, { useState } from "react"

export const AsyncTest: React.FC = () => {
	const [checked, setChecked] = useState(false)
	return (
		<div>
			<label htmlFor="test">Check me</label>
			<input
				type="checkbox"
				id="test"
				checked={checked}
				onChange={(evt) => setChecked(evt.target.checked)}
			/>
		</div>
	)
}

export default AsyncTest
