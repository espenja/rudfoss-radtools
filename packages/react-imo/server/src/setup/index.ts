import { Application } from "express"
import { routes } from "./routes"
import { globalMiddleware } from "./globalMiddleware"

export const setup = async (server: Application) => {
	server.set("trust proxy", true)

	await globalMiddleware(server)
	await routes(server)
}

export default setup
