import { Application } from "express"
import { asyncHandler, AsyncRequestHandler } from "utils/asyncExpress"
import { ExtendedRequest } from "./globalMiddleware"

const handle = (handler: AsyncRequestHandler<ExtendedRequest>) =>
	asyncHandler(handler)

export const routes = async (server: Application) => {
	server.get(
		"*",
		handle(async (req) => ({
			response: "hello world",
			id: req.id
		}))
	)
}
