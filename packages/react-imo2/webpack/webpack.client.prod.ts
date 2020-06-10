import path from "path"
import webpack, { DefinePlugin } from "webpack"

import ForkTSCheckerPlugin from "fork-ts-checker-webpack-plugin"
import HtmlPlugin from "html-webpack-plugin"
import TsConfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"

const CACHE_ENABLED = true // Control caching for all rules/plugins and optimizers

const ROOT_FOLDER = path.resolve(__dirname, "../client")
const INDEX_JS_FILE = path.resolve(ROOT_FOLDER, "index.ts")
const INDEX_HTML_FILE = path.resolve(ROOT_FOLDER, "index.html")
const DIST_FOLDER = path.resolve(__dirname, "../dist/client")
const TS_CONFIG_PATH = path.resolve(ROOT_FOLDER, "../tsconfig.json")

// Fix for TsConfigPathsPlugin trying to load multiple configuration files
process.env.TS_NODE_PROJECT = ""

export default async () => {
	const config: webpack.Configuration = {
		mode: "production",
		target: "web",
		devtool: "source-map",

		entry: [
			// https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import#working-with-webpack-and-babel-preset-env
			// "core-js/modules/es.promise",
			// "core-js/modules/es.array.iterator",

			INDEX_JS_FILE
		],

		optimization: {
			namedChunks: true,
			runtimeChunk: "multiple",
			minimize: true,
			minimizer: [
				new TerserPlugin({
					sourceMap: true,
					cache: CACHE_ENABLED
				})
			],
			splitChunks: {
				chunks: "all"
			}
		},

		output: {
			// https://medium.com/@sahilkkrazy/hash-vs-chunkhash-vs-contenthash-e94d38a32208
			filename: "js/[name]-[contenthash].js",
			chunkFilename: "js/[name]-[contenthash].js",
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
			new HtmlPlugin({
				template: INDEX_HTML_FILE,
				minify: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					keepClosingSlash: true,
					removeRedundantAttributes: true,
					removeStyleLinkTypeAttributes: true,
					useShortDoctype: true
				}
			}),
			new ForkTSCheckerPlugin({
				tsconfig: TS_CONFIG_PATH
			}),
			new DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify("production")
			})
		]
	}

	return config
}