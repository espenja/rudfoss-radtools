import express from "express"
import { createHttpServer } from "./createHttpServer"

const start = async () => {
	console.log("init")

	const app = express()

	app.get("/", (req, res) => {
		res.json({ hello: "world" })
	})

	await createHttpServer({
		expressApp: app,
		secure: process.env.NODE_ENV !== "production"
	})

	console.log("ready")
}

start().catch((e) => {
	console.error(e)
	process.exit(1)
})
