import webpack from "webpack"
import clientConfig from "../webpack/webpack.client.prod"
import ssrConfig from "../webpack/webpack.ssr.prod"
import serverConfig from "../webpack/webpack.server.prod"

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
	Promise.all([buildClient(), buildSSR(), buildServer()])
	console.log("done")
}

start().catch((error) => {
	console.error(error)
	process.exit(1)
})
