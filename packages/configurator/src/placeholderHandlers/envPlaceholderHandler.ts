import { ConfigPlaceholderHandler } from "../interfaces/IConfigurator"
import { parseValue } from "../utils/parseValue"

/**
 * Replaces the placeholder with the value of an environment variable. Supports multiple variable names and will use
 * the first defined value. If the last segment is wrapped in single quotes it is assumed to be a default value and will
 * be parsed and outputted if no environment variables match the preceeding segments.
 *
 * If no environment variables are defined and no default value is provided an error is thrown.
 * @param opts
 */
export const envPlaceholderHandler: ConfigPlaceholderHandler<any, any> = (
	opts
) => {
	for (const segment of opts.segments) {
		const val = process.env[segment]
		if (val) {
			return parseValue(val)
		}
	}

	const lastSegment = opts.segments[opts.segments.length - 1]
	if (lastSegment.startsWith("'") && lastSegment.endsWith("'")) {
		// assume last segment is a default value and parse accordingly
		return parseValue(lastSegment.substr(1, lastSegment.length - 2))
	}

	throw new Error(
		`Failed to resolve env placeholder ${opts.value}. No env variable found and no default value provided.`
	)
}

export default envPlaceholderHandler
