import { Application } from "express"

export const routes = async (server: Application) => {
	server.get("*", (req, res) => {
		res.send({ response: "Hello world", id: req.id })
	})
}
