import { Application } from "express"
import { asyncHandler, AsyncRequestHandler } from "utils/asyncExpress"
import { ExtendedRequest } from "./globalMiddleware"
import { render } from "../../../client/src/index.ssr"

const handle = (handler: AsyncRequestHandler<ExtendedRequest>) =>
	asyncHandler(handler)

export const routes = async (server: Application) => {
	server.get(
		"/test",
		handle(() => render())
	)

	server.get(
		"/hello",
		handle(async (req) => ({
			response: "hello world",
			id: req.id
		}))
	)
}
