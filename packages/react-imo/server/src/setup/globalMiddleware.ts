import { Application, Request } from "express"
import { idMiddleware, IIDMiddlewareRequest } from "./idMiddleware"
import { asyncHandler } from "utils/asyncExpress"

export const globalMiddleware = async (server: Application) => {
	server.use(asyncHandler(idMiddleware))
}

export type ExtendedRequest = Request & IIDMiddlewareRequest
