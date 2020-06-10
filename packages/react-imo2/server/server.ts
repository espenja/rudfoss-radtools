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
			indexHTMLPath: path.resolve(
				__dirname,
				process.env.SSR_HTML_PATH || "../client/.cache/index.html"
			),
			ssrAppPath: path.resolve(
				__dirname,
				process.env.SSR_APP_PATH || "../client/.cache/index.ssr.js"
			),
			hot: true
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
