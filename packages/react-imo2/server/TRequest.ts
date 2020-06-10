import { Request } from "express"
import { logger } from "utils/logger"
import { Debugger } from "debug"

export type TRequest = Request & {
	logger: typeof logger
	log: Debugger
	err: Debugger
}
