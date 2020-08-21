import { useEffect, useState, useCallback } from "react"

/**
 * The different states that the async function can be in.
 */
export enum AsyncState {
	"idle",
	"pending",
	"success",
	"error"
}

/**
 * A hook that captures the state of an async function call allowing render
 * changes to occur based on them.
 * @see https://usehooks.com/useAsync/
 * @param asyncFunction - The function to execute
 * @param immediate - Will immediately execute the async function when the hook is created.
 */
export const useAsync = <TResponse>(
	asyncFunction: () => Promise<TResponse>,
	immediate = true
) => {
	const [status, setStatus] = useState<AsyncState>(AsyncState.idle)
	const [value, setValue] = useState<TResponse | undefined>(undefined)
	const [error, setError] = useState<Error | undefined>(undefined)

	// The execute function wraps asyncFunction and
	// handles setting state for pending, value, and error.
	// useCallback ensures the below useEffect is not called
	// on every render, but only if asyncFunction changes.
	const execute = useCallback(() => {
		setStatus(AsyncState.pending)
		setValue(undefined)
		setError(undefined)

		return asyncFunction()
			.then((response) => {
				setValue(response)
				setStatus(AsyncState.success)
			})

			.catch((error) => {
				setError(error)
				setStatus(AsyncState.error)
			})
	}, [asyncFunction])

	// Call execute if we want to fire it right away.
	// Otherwise execute can be called later, such as
	// in an onClick handler.
	useEffect(() => {
		if (immediate) {
			execute()
		}
	}, [execute, immediate])

	return { execute, status, value, error }
}
