import debug from "debug"

/**
 * Creates new loggers for the provided namespace
 * @param name
 */
export const logger = (name: string) => {
	const log = debug(name)
	log.log = console.log.bind(console)
	const err = debug(`${name}:error`)
	return { log, err }
}
