import path from "path"
import webpack, { DefinePlugin } from "webpack"
import "webpack-dev-server" // Adds devServer types to configuration

import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import HtmlHarddiskPlugin from "html-webpack-harddisk-plugin"
import HtmlPlugin from "html-webpack-plugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"

const CACHE_ENABLED = true // Control caching for all rules/plugins and optimizers

const ROOT_FOLDER = path.resolve(__dirname, "../")
const INDEX_JS_FILE = path.resolve(ROOT_FOLDER, "./app", "index.ts")
const INDEX_HTML_FILE = path.resolve(ROOT_FOLDER, "./app", "index.html")
const DIST_FOLDER = path.resolve(ROOT_FOLDER, ".cache")
const TS_CONFIG_PATH = path.resolve(ROOT_FOLDER, "tsconfig.json")

const PORT = 3010

export default async () => {
	const config: webpack.Configuration = {
		mode: "development",
		target: "web",
		devtool: "source-map",

		devServer: {
			historyApiFallback: true,
			hot: true,
			https: true,
			overlay: true,
			inline: true,
			writeToDisk: true,
			port: PORT,
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		},

		entry: [
			// https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
			// "core-js/modules/es.promise",
			// "core-js/modules/es.array.iterator",

			INDEX_JS_FILE
		],

		output: {
			filename: "js/[name]-[hash].js",
			chunkFilename: "js/[name]-[hash].js",
			publicPath: `https://localhost:${PORT}/`, // The last / is critical, without it reloading breaks
			path: DIST_FOLDER
		},

		resolve: {
			extensions: [".js", ".ts", ".tsx"],
			alias: {
				"react-dom": "@hot-loader/react-dom" // https://github.com/gaearon/react-hot-loader#hot-loaderreact-dom
			},
			plugins: [
				new TsConfigPathsPlugin({
					configFile: TS_CONFIG_PATH
				})
			]
		},

		module: {
			rules: [
				{
					// https://github.com/gaearon/react-hot-loader#typescript
					exclude: /node_modules/,
					test: /\.(t|j)sx?$/,
					use: [
						{
							loader: "babel-loader",
							options: {
								cacheDirectory: CACHE_ENABLED,
								babelrc: false,
								presets: [
									[
										"@babel/preset-env", // Adds dynamic imports of the necessary polyfills (see .browserslistrc for spec)
										{
											useBuiltIns: "usage",
											corejs: { version: 3, proposals: true },
											debug: true
										}
									],
									"@babel/preset-typescript",
									"@babel/preset-react"
								],
								plugins: [
									["@babel/plugin-proposal-class-properties", { loose: true }],
									"@babel/plugin-transform-runtime", // Adds support for async/await in older browsers
									"react-hot-loader/babel"
								]
							}
						}
					]
				}
			]
		},
		plugins: [
			new HtmlPlugin({
				template: INDEX_HTML_FILE,
				alwaysWriteToDisk: true,
				minify: false
			}),
			new HtmlHarddiskPlugin(),
			new ForkTSCheckerPlugin({
				tsconfig: TS_CONFIG_PATH
			}),
			new DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify("development")
			})
		]
	}

	return config
}
