import path from "path"
import webpack, { DefinePlugin } from "webpack"

import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import HtmlHarddiskPlugin from "html-webpack-harddisk-plugin"
import HtmlPlugin from "html-webpack-plugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"

const CACHE_ENABLED = true // Control caching for all rules/plugins and optimizers

const ROOT_FOLDER = path.resolve(__dirname, "../server")
const SRC_FOLDER = path.resolve(ROOT_FOLDER, "src")
const INDEX_JS_FILE = path.resolve(SRC_FOLDER, "server.ts")
const DIST_FOLDER = path.resolve(ROOT_FOLDER, "dist-dev")
const TS_CONFIG_PATH = path.resolve(ROOT_FOLDER, "tsconfig.json")

// Fix for TsConfigPathsPlugin trying to load multiple configuration files
process.env.TS_NODE_PROJECT = ""

export default async () => {
	const config: webpack.Configuration = {
		mode: "production",
		target: "node",
		devtool: "source-map",

		entry: [INDEX_JS_FILE],

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
											targets: {
												node: "current"
											},
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
			new DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify("development")
			})
		]
	}

	return config
}
