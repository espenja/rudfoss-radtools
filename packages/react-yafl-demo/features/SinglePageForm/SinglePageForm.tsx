import React from "react"
import { TextField } from "features/fields"
import { useField } from "react-yafl"

const fieldProps = (name: string, label: string) => {
	const field = useField(name)
	return {
		field,
		props: {
			id: name,
			label,
			value: field.value,
			onChange: field.set
		}
	}
}

export const SinglePageForm: React.FC = () => {
	const firstName = fieldProps("firstname", "First name")
	const middleName = fieldProps("middlename", "Middle name")
	const lastName = fieldProps("lastname", "Last name")

	return (
		<>
			<TextField {...firstName.props} />
			<TextField {...middleName.props} />
			<TextField {...lastName.props} />
		</>
	)
}

export default SinglePageForm
