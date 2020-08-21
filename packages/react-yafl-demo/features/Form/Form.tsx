import React from "react"
import { FormOptions, useForm, FormProvider, handleSubmit, DebugForm, OnSuccess } from "react-yafl"

interface FormProps {
	title: string
	onSubmit: OnSuccess
	validator?: FormOptions["validator"]
}

export const Form: React.FC<FormProps> = ({ title, validator, onSubmit, children }) => {
	const form = useForm({ validator })

	return (
		<FormProvider form={form}>
			<h1>{title}</h1>
			<hr />
			<form onSubmit={handleSubmit(form)(onSubmit)}>{children}</form>
			<DebugForm />
		</FormProvider>
	)
}

export default Form
