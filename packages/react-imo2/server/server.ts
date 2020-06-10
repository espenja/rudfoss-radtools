import express from "express"
import { createHttpServer } from "./createHttpServer"
import { render } from "./ssr"
import path from "path"

const start = async () => {
	console.log("init")

	const app = express()

	app.get(
		"*",
		render({
			indexHTMLPath: path.resolve(__dirname, "../client/.cache/index.html"),
			ssrAppRender: require("../client/index.ssr").render
		})
	)

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
