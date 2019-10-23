import { ConfigPlaceholderHandler } from "../interfaces/IConfigurator"

export interface IHandlerObject<TConfig> {
	[key: string]: ConfigPlaceholderHandler<TConfig, any>
}

const SEGMENT_RX = (() => {
	const rx = /'.+?'|[^\s]+/g
	return () => {
		rx.lastIndex = 0
		return rx
	}
})()
/**
 * Determines if the given string contains the prefix and if so parses out individual segments and returns them.
 * If it is not prefixed `undefined` is returned
 * @param value
 * @param placeholderPrefix
 */
const parsePlaceholder = (value: string, placeholderPrefix: string) => {
	if (!value.startsWith(placeholderPrefix)) {
		return
	}
	const normalizedValue = value.substr(placeholderPrefix.length)

	const matches = normalizedValue.match(SEGMENT_RX())
	if (!matches) return
	const [placeholder, ...segments] = matches
	return {
		placeholder,
		segments
	}
}

const processValue = async <TConfig>(opts: {
	key: string | number
	path: string
	value: string
	config: any
	prefix: string
	ignoreUnknown?: boolean
	handlers: IHandlerObject<TConfig>
}) => {
	const {key, path, value, config, prefix, ignoreUnknown, handlers} = opts
	const parsedPlaceholder = parsePlaceholder(value, prefix)
	if (!parsedPlaceholder) {
		return value
	}

	const {placeholder, segments} = parsedPlaceholder
	const handler = handlers[placeholder]
	if (!handler) {
		if (ignoreUnknown) {
			return value
		}
		throw new Error(`No placeholder handler registered for "${placeholder}"`)
	}

	return handler({
		config,
		key,
		path,
		value,
		placeholder,
		segments
	})
}

const traverse = async <TConfig>(obj: any | any[], opts: {
	path?: string
	config: TConfig
	handlers: IHandlerObject<TConfig>
	ignoreUnknown?: boolean
	prefix: string
}) => {
	const {path = ""} = opts

	const entries: Array<[number | string, any]> = Array.isArray(obj) ?
		obj.map((val, idx) => [idx, val]):
		Object.entries(obj)

	for (const [key, value] of entries) {
		if (Array.isArray(value)) {
			obj[key] = await traverse(value, {
				...opts,
				path: path === "" ? `[${key}]` : `${path}[${key}]`
			})
		} else if (typeof value === "object") {
			obj[key] = await traverse(value, {
				...opts,
				path: path === "" ? key.toString() : `${path}.${key}`
			})
		} else if (typeof value === "string") {
			obj[key] = await processValue({
				...opts,
				path: path === "" ? key.toString() : `${path}.${key}`,
				value,
				key
			})
		}
	}

	return obj as TConfig
}

export const processPlaceholderHandlers = async <TConfig>(
	config: TConfig,
	ignoreUnknownHandlers: boolean,
	handlers: IHandlerObject<TConfig>,
	prefix: string = "::"): Promise<TConfig> => {
	return traverse(config, {
		config,
		handlers,
		ignoreUnknown: ignoreUnknownHandlers,
		prefix
	})
}

export default processPlaceholderHandlers
