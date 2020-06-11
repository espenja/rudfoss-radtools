import express from "express"
import { createHttpServer } from "./createHttpServer"
import { logger } from "utils/logger"
import { getConfig } from "./getConfig"
import { ssrMiddleware } from "ssr/ssrMiddleware"
import { ssrRender } from "ssr/ssrRender"

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
	app.use(
		ssrMiddleware({
			appRootFilePath: config.ssr.appPath,
			indexHTMLPath: config.ssr.indexHTMLPath
		})
	)

	app.use(express.static(config.staticPath, { index: false }))
	app.get("*", ssrRender)

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
