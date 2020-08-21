import { IRecordOfAny } from "utilities/ts/IRecordOfAny"

/**
 * Creates a checker function that can extract the value of a key from an object
 * if present. If not the key is added to the missingKeys array.
 *
 * E.g.:
 * ```
 * const {check, missingKeys } = checkObjectKeys(process.env)
 * const valueOfNodeENV = check("NODE_ENV")
 * if (missingKeys.length > 0) {
 * 	throw new Error(`Missing keys ${missingKeys.join(", ")}`)
 * }
 * ```
 * @param obj
 * @param arr
 */
export const checkObjectKeys = (obj: IRecordOfAny, missingKeys: string[] = []) => {
	/**
	 * A function that will check for the existence of the property within the
	 * object and add it to the missingKeys array if optional is false.
	 * @param varName
	 * @param optional
	 */
	const checker = (varName: string, optional = false): string => {
		if (!obj[varName] && !optional) {
			missingKeys.push(varName)
		}

		return obj[varName]
	}
	return {
		check: checker,
		missingKeys
	}
}
