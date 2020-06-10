import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import clientConfig from "../webpack/webpack.client.dev"
import ssrConfig from "../webpack/webpack.ssr.dev"

const startWebpackDevServer = async () => {
	const config = await clientConfig()
	const server = new WebpackDevServer(webpack(config), config.devServer)

	return new Promise((resolve, reject) => {
		server.listen(config.devServer?.port || 3010, (err) => {
			if (err) {
				reject(err)
				return
			}
			resolve(server)
		})
	})
}
const startWebpackSSR = async () => {
	const config = await ssrConfig()
	return new Promise((resolve, reject) => {
		webpack(config).watch({}, (err, stats) => {
			if (err) {
				reject(err)
				return
			}
			resolve()
		})
	})
}

const start = async () => {
	await Promise.all([startWebpackDevServer(), startWebpackSSR()])
	console.log("WebpackDevServer started")
}

start().catch((error) => {
	console.error(error)
	process.exit(1)
})
