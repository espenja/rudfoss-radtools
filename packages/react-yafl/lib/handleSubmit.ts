import { useForm } from "./useForm"

export type OnSuccess = (values: any, form?: ReturnType<typeof useForm>) => void

/**
 * Wrapper for handling the submit event on a `<form>` tag. Will prevent the
 * default action and instead trigger `check` on the provided form.
 *
 * The callback function will be called only if validation of the form data
 * succeeds.
 *
 * @param form the form instance to submit
 */
export const handleSubmit = (form: ReturnType<typeof useForm>) => (onSuccess: OnSuccess) => async (
	evt?: React.BaseSyntheticEvent
) => {
	if (evt && evt.preventDefault) {
		evt.preventDefault()
	}

	const submitSuccess = await form.check()
	if (submitSuccess) {
		onSuccess(form.values, form)
	}
}
