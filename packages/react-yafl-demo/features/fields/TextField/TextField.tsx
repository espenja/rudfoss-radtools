import React from "react"
import { onChangeHelper } from "utilities/react/onChangeHelper"

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	id: string
	label: string
	value: string
	onChange: (newValue: string) => void

	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">
}

export const TextField: React.FC<TextFieldProps> = ({ id, label, value, onChange, inputProps = {} }) => (
	<div>
		<label htmlFor={id}>{label}</label>
		<input type="text" value={value || ""} onChange={onChangeHelper(onChange)} {...inputProps} />
	</div>
)

export default TextField
