import { Application } from "express"
import { idMiddleware } from "./idMiddleware"
import { asyncHandler } from "utils/asyncExpress"

export const globalMiddleware = async (server: Application) => {
	server.use(asyncHandler(idMiddleware))
}
