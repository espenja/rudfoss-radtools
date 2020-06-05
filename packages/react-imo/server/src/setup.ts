import { Application } from "express"

export const setup = async (server: Application) => {
	server.set("trust proxy", true)

	server.get("*", (req, res) => {
		res.send({ response: "Hello world" })
	})
}
