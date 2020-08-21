import { useState, useEffect } from "react"

/**
 * Returns a value that is updated only after it remains unchanged for the specified delay.
 * @param value A value that changes frequently.
 * @param delayMS The number of milliseconds to wait for the value to settle before returning it.
 */
export const useDebounce = <TValue>(value: TValue, delayMS: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delayMS)
		return () => {
			clearTimeout(timeoutId)
		}
	}, [value, delayMS])

	return debouncedValue
}
