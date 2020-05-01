/**
 * Tries to parse a string value into it's most likely type (number, boolean or string)
 * @param value The value to try and parse.
 * @returns The parsed value of proper type or value if it could not be parsed.
 */
export const parseValue = (value?: string) => {
	if (!value) return value
	const normalizedValue = value.trim().toLocaleLowerCase()
	const numericMatch = normalizedValue.match(/^([0-9]*)[.,]{0,1}([0-9]*)$/)
	if (numericMatch) {
		const [num = 0, decimal] = numericMatch
		if (!decimal) {
			return parseInt(num.toString(), 10)
		}
		return parseFloat(normalizedValue)
	}

	if (normalizedValue === "true" || normalizedValue === "yes") {
		return true
	}
	if (normalizedValue === "false" || normalizedValue === "no") {
		return false
	}

	return value
}
