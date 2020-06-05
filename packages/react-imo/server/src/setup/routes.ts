import { Application } from "express"
import { asyncHandler } from "utils/asyncExpress"
import { ExtendedRequest } from "./globalMiddleware"

export const routes = async (server: Application) => {
	server.get(
		"*",
		asyncHandler<ExtendedRequest>(async (req) => {
			return {
				response: "hello world",
				id: req.id
			}
		})
	)
}
