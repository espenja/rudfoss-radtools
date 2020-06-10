import express from "express"
import { createHttpServer } from "./createHttpServer"
import { render } from "./ssr"
import { logger } from "utils/logger"
import { getConfig } from "./getConfig"

const { log, err } = logger("server")

const start = async () => {
	log("init")

	const config = getConfig()
	log(config)
	const app = express()

	app.use((req: any, res, next) => {
		req.logger = { logger, ...logger("req") }
		req.config = config
		req.config = next()
	})

	app.use(express.static(config.staticPath))

	app.get(
		"/",
		render({
			indexHTMLPath: config.ssr.indexHTMLPath,
			ssrAppPath: config.ssr.appPath,
			hot: true
		})
	)

	await createHttpServer({
		expressApp: app,
		secure: process.env.NODE_ENV !== "production"
	})

	log("ready")
}

start().catch((e) => {
	err(e)
	process.exit(1)
})
