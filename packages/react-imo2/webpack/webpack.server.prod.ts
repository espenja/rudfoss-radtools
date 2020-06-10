import path from "path"
import webpack, { DefinePlugin } from "webpack"

import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"

const CACHE_ENABLED = true // Control caching for all rules/plugins and optimizers

const ROOT_FOLDER = path.resolve(__dirname, "../server")
const INDEX_JS_FILE = path.resolve(ROOT_FOLDER, "server.ts")
const DIST_FOLDER = path.resolve(__dirname, "../dist")
const TS_CONFIG_PATH = path.resolve(ROOT_FOLDER, "../tsconfig.json")

export default async () => {
	const config: webpack.Configuration = {
		mode: "production",
		target: "node",
		devtool: "source-map",

		entry: [INDEX_JS_FILE],

		node: {
			__dirname: false
		},

		output: {
			filename: "server.js",
			path: DIST_FOLDER
		},

		resolve: {
			extensions: [".js", ".ts", ".tsx"],
			plugins: [
				new TsConfigPathsPlugin({
					configFile: TS_CONFIG_PATH
				})
			]
		},

		optimization: {
			runtimeChunk: false,
			minimize: true,
			minimizer: [
				new TerserPlugin({
					sourceMap: true,
					cache: CACHE_ENABLED
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
									"@babel/plugin-transform-runtime" // Adds support for async/await in older browsers
								]
							}
						}
					]
				}
			]
		},
		plugins: [
			new webpack.optimize.LimitChunkCountPlugin({
				maxChunks: 1
			}),
			new DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify("production"),

				// Paths are relative to the server.js file
				"process.env.STATIC_PATH": `"./client"`,
				"process.env.SSR_APP_PATH": `"./index.ssr.js"`,
				"process.env.SSR_HTML_PATH": `"./index.html"`
			})
		]
	}

	return config
}
