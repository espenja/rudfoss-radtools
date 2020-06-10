import webpack from "webpack"
import clientConfig from "../webpack/webpack.client.prod"
import ssrConfig from "../webpack/webpack.ssr.prod"
import serverConfig from "../webpack/webpack.server.prod"
import { movePath } from "../utils/node/movePath"
import path from "path"

const DIST_DIR = path.resolve(__dirname, "../dist")

const buildClient = async () => {
	const config = await clientConfig()
	return new Promise((resolve, reject) => {
		webpack(config).run((err, stats) => {
			if (err) {
				reject(err)
			}
			resolve()
		})
	})
}
const buildSSR = async () => {
	const config = await ssrConfig()
	return new Promise((resolve, reject) => {
		webpack(config).run((err, stats) => {
			if (err) {
				reject(err)
			}
			resolve()
		})
	})
}
const buildServer = async () => {
	const config = await serverConfig()
	return new Promise((resolve, reject) => {
		webpack(config).run((err, stats) => {
			if (err) {
				reject(err)
			}
			resolve()
		})
	})
}

const start = async () => {
	await Promise.all([buildClient(), buildSSR(), buildServer()])
	await movePath(
		path.join(DIST_DIR, "client/index.html"),
		path.join(DIST_DIR, "index.html")
	)
	console.log("done")
}

start().catch((error) => {
	console.error(error)
	process.exit(1)
})
