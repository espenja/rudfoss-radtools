import React from "react"
import SinglePageForm from "./SinglePageForm"
import { OnSuccess } from "react-yafl"
import Form from "features/Form"

export const SinglePageFormWrapper: React.FC = () => {
	const onSubmit: OnSuccess = (values) => {
		console.log("Submitted", values)
	}

	return (
		<Form onSubmit={onSubmit} title="Single page form">
			<SinglePageForm />
		</Form>
	)
}

export default SinglePageFormWrapper
