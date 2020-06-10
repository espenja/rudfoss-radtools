import webpack from "webpack"
import clientConfig from "../webpack/webpack.client.prod"
import ssrConfig from "../webpack/webpack.ssr.prod"
import serverConfig from "../webpack/webpack.server.prod"
import { movePath } from "utilities/node/movePath"
import path from "path"
import { copyFile } from "utilities/node/copyFile"

const DIST_DIR = path.resolve(__dirname, "../dist")
const DIST_PUBLIC_DIR = path.resolve(__dirname, "../dist/public")
const PUBLIC_DIR = path.resolve(__dirname, "../public")

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
const copyOrMove = async (source: string, dest: string, move = false) => {
	console.log(`${move ? "MOVE" : "COPY"}: ${source} -> ${dest}`)
	return move ? movePath(source, dest) : copyFile(source, dest)
}

const start = async () => {
	await Promise.all([buildClient(), buildSSR(), buildServer()])
	await copyOrMove(PUBLIC_DIR, path.join(DIST_PUBLIC_DIR))
	await copyOrMove(
		path.join(DIST_DIR, "public/index.html"),
		path.join(DIST_DIR, "index.html"),
		true
	)
	console.log("Build completed")
}

start().catch((error) => {
	console.error(error)
	process.exit(1)
})
