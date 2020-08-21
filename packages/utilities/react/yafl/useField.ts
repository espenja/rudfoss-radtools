import { useMemo, useCallback, useState, useEffect } from "react"
import { useFormContext, generateId, FieldError, FormCtx } from "./useForm"

const useWatcherWrapper = (
	registerWatcher: any,
	unregisterWatcher: any,
	pickProperties: (props?: string[]) => { [key: string]: any }
) => (name?: string | string[]) => {
	const watchId = useMemo(() => generateId(), [name])
	const pickedProps = useMemo(
		() =>
			typeof name === "string"
				? pickProperties([name])[name]
				: pickProperties(name),
		[name]
	)
	const [localValues, setLocalValues] = useState<any>(pickedProps)

	const updater = useCallback(
		(newValues) => {
			if (!name) {
				setLocalValues(newValues)
				return
			}

			if (!Array.isArray(name)) {
				setLocalValues(newValues[name])
				return
			}

			setLocalValues(newValues)
		},
		[name]
	)

	useEffect(() => {
		const oldWatchId = watchId
		registerWatcher(oldWatchId, updater, name)
		return () => {
			unregisterWatcher(oldWatchId)
		}
	}, [watchId])

	return localValues
}

/**
 * Listens for changes to one or more field values
 * @param name
 */
export const useValueWatcher = (
	name?: string | string[],
	formContext?: FormCtx
) => {
	const { registerWatcher, unregisterWatcher, pickValues } = useFormContext(
		formContext
	)
	return useWatcherWrapper(registerWatcher, unregisterWatcher, pickValues)(name)
}
export const useErrorWatcher = (
	name?: string | string[],
	formContext?: FormCtx
) => {
	const {
		registerErrorWatcher,
		unregisterErrorWatcher,
		pickErrors
	} = useFormContext(formContext)
	return useWatcherWrapper(
		registerErrorWatcher,
		unregisterErrorWatcher,
		pickErrors
	)(name)
}
export const useVisitedWatcher = (
	name?: string | string[],
	formContext?: FormCtx
) => {
	const {
		registerVisitedWatcher,
		unregisterVisitedWatcher,
		pickVisited
	} = useFormContext(formContext)
	return useWatcherWrapper(
		registerVisitedWatcher,
		unregisterVisitedWatcher,
		pickVisited
	)(name)
}

export const useField = <TFieldValueType = any>(
	name: string,
	formContext?: FormCtx
) => {
	const {
		setValues,
		setVisited: setVisitedFields,
		validate: validator
	} = useFormContext(formContext)
	const value: TFieldValueType = useValueWatcher(name)
	const visited: boolean = useVisitedWatcher(name)
	const errors: FieldError[] | undefined = useErrorWatcher(name)

	const set = useCallback(
		(newValue: TFieldValueType) => {
			setValues({ [name]: newValue })
		},
		[name]
	)
	const setVisited = useCallback(
		(flag = true) => {
			setVisitedFields({ [name]: flag })
		},
		[name]
	)
	const validate = useCallback(async () => validator([name]), [name])

	return {
		value,
		visited,
		errors,

		set,
		setVisited,
		validate
	}
}
