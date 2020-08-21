import React from "react"
import { FormContext, useForm } from "./useForm"

interface FormProviderProps {
	form: ReturnType<typeof useForm>
}

export const FormProvider: React.FC<FormProviderProps> = ({ form, children }) => {
	return <FormContext.Provider value={form}>{children}</FormContext.Provider>
}

export default FormProvider
