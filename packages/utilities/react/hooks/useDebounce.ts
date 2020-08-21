import { useState, useEffect } from "react"

export const useDebounce = <TValue>(value: TValue, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)
		return () => {
			clearTimeout(timeoutId)
		}
	}, [value, delay])

	return debouncedValue
}
