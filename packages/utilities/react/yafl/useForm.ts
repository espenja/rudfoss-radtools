import { useRef, useContext, useCallback, useMemo, createContext } from "react"
import { idGenerator } from "./generateId"
import { WatcherObject, useWatchObject } from "./useWatchObject"

export const generateId = idGenerator("yafl-")

export enum ValidateOn {
	"Change",
	"Submit",
	"Never"
}

/**
 * Defines an error for a field
 */
export interface FieldError {
	message?: string
}

export interface FormValidationResult {
	errors?: WatcherObject<FieldError[]>
}
export type FormValidator<TFormValues = WatcherObject<any>> = (
	values: TFormValues,
	changedFieldNames?: string[]
) => FormValidationResult | Promise<FormValidationResult>

export interface FormOptions<TDefaultValues = { [key: string]: any }> {
	validator?: FormValidator
	validateOn?: ValidateOn
	reValidateOn?: ValidateOn
	initialValues?: TDefaultValues
}
const defaultOptions = (
	options: FormOptions = {}
): FormOptions &
	Required<
		Pick<FormOptions, "validateOn" | "reValidateOn" | "initialValues">
	> => ({
	validateOn: ValidateOn.Submit,
	reValidateOn: ValidateOn.Change,
	initialValues: {},
	...options
})

/**
 * Initializes a new form data-store.
 */
export const useForm = (options: FormOptions = {}) => {
	const optionsRef = useRef(defaultOptions(options))
	const reValidateWatcherId = useMemo(() => generateId(), [])

	useMemo(() => {
		if (optionsRef.current.validateOn === ValidateOn.Change) {
			throw new Error("ValidateOn.Change currently not supported")
		}
	}, [])

	const {
		values,
		pickProperties: pickValues,
		registerWatcher,
		unregisterWatcher,
		setValues,
		unsetValues,
		resetValues
	} = useWatchObject<any>(optionsRef.current.initialValues)
	const {
		values: errors,
		pickProperties: pickErrors,
		registerWatcher: registerErrorWatcher,
		unregisterWatcher: unregisterErrorWatcher,
		setValues: setErrors,
		unsetValues: unsetErrors,
		resetValues: resetErrors
	} = useWatchObject<FieldError[]>()
	const {
		values: visited,
		pickProperties: pickVisited,
		registerWatcher: registerVisitedWatcher,
		unregisterWatcher: unregisterVisitedWatcher,
		setValues: setVisited,
		unsetValues: unsetVisited,
		resetValues: resetVisited
	} = useWatchObject<boolean>()

	const setValue = useCallback(
		(name: string) => (newValue: any, silent = false) =>
			setValues({ [name]: newValue }, silent),
		[setValues]
	)
	const unsetValue = useCallback(
		(name: string, silent = false) => unsetValues([name], silent),
		[unsetValues]
	)
	const hasErrors = useCallback(() => Object.keys(errors).length > 0, [])

	/**
	 * Performs raw validation and updates the error data and any associated watchers.
	 * Validates regardless of the state of the `validateOn` or `reValidateOn` options
	 * Does not trigger revalidation.
	 */
	const validate = useCallback(async (fieldNames?: string[]) => {
		if (!optionsRef.current.validator) {
			return {}
		}

		const result = await optionsRef.current.validator(values, fieldNames)

		if (!fieldNames) {
			// A generic validation. All fields must be reset
			unsetErrors()
			setErrors(result.errors || {})
			return result
		}

		// Specific subset of fields validated. Only update those fields
		if (!result.errors) {
			unsetErrors(fieldNames)
			return result
		}

		const unsetFields = fieldNames.filter(
			(fieldName) => !result.errors![fieldName]
		)
		unsetErrors(unsetFields)
		setErrors(result.errors || {})
		return result
	}, [])

	/**
	 * Validates all data in the form and using the specified validator method and queues any fields with
	 * errors for re-validation using the `reValidateOn` method.
	 *
	 * Returns true or false depending on whether the validation succeeded or not.
	 */
	const check = useCallback(async () => {
		if (optionsRef.current.validateOn === ValidateOn.Never) {
			return false
		}

		if (optionsRef.current.validateOn === ValidateOn.Submit) {
			unregisterWatcher(reValidateWatcherId)
			const result = await validate()
			const foundErrors = result.errors && Object.keys(result.errors).length > 0
			if (foundErrors) {
				if (optionsRef.current.reValidateOn === ValidateOn.Change) {
					registerWatcher(
						reValidateWatcherId,
						(newValues, watchedProps) => validate(watchedProps),
						Object.keys(result.errors!)
					)
				}
			}
			return !foundErrors
		}

		return hasErrors()
	}, [])

	const getState = useCallback(() => {
		return {
			values,
			errors,
			visited
		}
	}, [])
	const setState = useCallback(
		(state: Partial<ReturnType<typeof getState>>, silent = false) => {
			setValues(state.values || {}, silent)
			setErrors(state.errors || {}, silent)
			setVisited(state.visited || {}, silent)
		},
		[]
	)

	const reset = useCallback(() => {
		unregisterWatcher(reValidateWatcherId)
		resetValues()
		resetErrors()
		resetVisited()
	}, [])

	return {
		values,
		pickValues,
		registerWatcher,
		unregisterWatcher,
		setValues,
		setValue,
		unsetValues,
		unsetValue,
		resetValues,

		errors,
		pickErrors,
		registerErrorWatcher,
		unregisterErrorWatcher,
		setErrors,
		clearErrors: unsetErrors,
		hasErrors,
		resetErrors,

		visited,
		pickVisited,
		registerVisitedWatcher,
		unregisterVisitedWatcher,
		setVisited,
		unsetVisited,
		resetVisited,

		validate,
		check,

		getState,
		setState,
		reset
	}
}

export type FormCtx = ReturnType<typeof useForm>

export const FormContext = createContext<FormCtx>(undefined as any)

export const useFormContext = (formCtx?: FormCtx) => {
	if (formCtx) return formCtx

	const ctx = useContext(FormContext)
	if (!ctx) {
		throw new Error(
			"No FormContext found. Did you forget to wrap this component in a <FormProvider>?"
		)
	}
	return ctx
}
