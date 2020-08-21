import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import makeConfig from "../webpack/webpack.dev"

const start = async () => {
	const config = await makeConfig()
	const server = new WebpackDevServer(webpack(config), config.devServer)

	server.listen(config.devServer?.port || 3010, (err) => {
		if (err) {
			console.error(err)
		}
	})
}

start().catch((error) => {
	console.error(error)
	process.exit(1)
})
