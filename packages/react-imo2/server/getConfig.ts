import path from "path"

export interface IConfig {
	ssr: {
		indexHTMLPath: string
		appPath: string
	}

	staticPath: string
}

export const getConfig = (basePath: string = __dirname): IConfig => ({
	ssr: {
		indexHTMLPath: path.resolve(
			basePath,
			process.env.SSR_HTML_PATH || "../client/.cache/index.html"
		),
		appPath: path.resolve(
			basePath,
			process.env.SSR_APP_PATH || "../client/.cache/index.ssr.js"
		)
	},
	staticPath: path.resolve(
		basePath,
		process.env.STATIC_PATH || "../client/.cache"
	)
})
