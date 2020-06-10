import path from "path"
import webpack, { DefinePlugin } from "webpack"
import "webpack-dev-server" // Adds devServer types to configuration

import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"

const CACHE_ENABLED = true // Control caching for all rules/plugins and optimizers

const ROOT_FOLDER = path.resolve(__dirname, "../client")
const INDEX_JS_FILE = path.resolve(ROOT_FOLDER, "index.ssr.ts")
const DIST_FOLDER = path.resolve(ROOT_FOLDER, ".cache")
const TS_CONFIG_PATH = path.resolve(ROOT_FOLDER, "../tsconfig.json")

// Fix for TsConfigPathsPlugin trying to load multiple configuration files
process.env.TS_NODE_PROJECT = ""

export default async () => {
	const config: webpack.Configuration = {
		mode: "development",
		target: "node",
		devtool: "source-map",

		entry: [
			// https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
			// "core-js/modules/es.promise",
			// "core-js/modules/es.array.iterator",

			INDEX_JS_FILE
		],

		output: {
			filename: "index.ssr.js",
			path: DIST_FOLDER,
			libraryTarget: "commonjs2"
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
											debug: false
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
				"process.env.NODE_ENV": JSON.stringify("development")
			})
		]
	}

	return config
}