import { RequestHandler } from "express"
import { TSSRRequest, ISSRAppBaseState } from "./ssrMiddleware"
import { readUTFFile } from "utilities/node/readFile"
import cheerio from "cheerio"
import { hotRequire } from "utilities/node/hotRequire"
import startupSSR from "./gateways/startupSSR"
import { RenderableError } from "./RenderableError"

const loadHtml = async (htmlPath: string) => {
	const html = await readUTFFile(htmlPath)
	return cheerio.load(html)
}
const getAppRenderer = (rootFilePath: string): typeof startupSSR => {
	return hotRequire(rootFilePath).default
}
const renderHtml = (
	page: CheerioStatic,
	appContent: string,
	styles: string,
	state: any = {}
) => {
	if (styles) {
		page("head").append(`<style type="text/css">${styles}</style>`)
	}
	if (state) {
		page("#appstate").html(JSON.stringify(state))
	}
	if (appContent) {
		page("#app").html(appContent)
	}

	return page.html()
}

/**
 * Renders the application with the current state and location information.
 * Once called data is returned to the client so you should not modify the request after calling this.
 * @param req
 * @param res
 * @param next
 */
export const ssrRender: RequestHandler = async (req, res, next) => {
	const treq: TSSRRequest<ISSRAppBaseState> = req as any
	const appRender = getAppRenderer(treq.ssrOptions.appRootFilePath)
	const html = await loadHtml(treq.ssrOptions.indexHTMLPath)

	try {
		const { appContent, context, styles } = appRender({
			state: treq.ssrState,
			url: treq.url
		})

		throw new Error("Test")

		res
			.status(context.statusCode || 200)
			.send(renderHtml(html, appContent, styles, treq.ssrState))
	} catch (error) {
		treq.ssrState.error = RenderableError.fromError(error).serialize()
		try {
			const { appContent, context, styles } = appRender({
				state: treq.ssrState,
				url: treq.url
			})
			res
				.status(context.statusCode || 500)
				.send(renderHtml(html, appContent, styles, treq.ssrState))
		} catch (error) {
			next(error)
		}
	}
}
