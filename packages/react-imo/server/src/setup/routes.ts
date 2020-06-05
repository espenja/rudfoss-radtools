import { Application } from "express"
import { asyncHandler, AsyncRequestHandler } from "utils/asyncExpress"
import { ExtendedRequest } from "./globalMiddleware"
import { render } from "../ssr/index.ssr"

const rootDir = process.env.ROOT_DIR

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
