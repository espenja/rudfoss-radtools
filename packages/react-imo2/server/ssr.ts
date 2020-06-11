import { RequestHandler } from "express"
import { readUTFFile } from "utilities/node/readFile"
import cheerio from "cheerio"
import { hotRequire } from "utilities/node/hotRequire"
import { TSSR, ISSRProps } from "client/TSSR"

import { logger } from "utils/logger"
const { log, err } = logger("ssr")

const getHtml = async (htmlPath: string) => {
	const html = await readUTFFile(htmlPath)
	return cheerio.load(html)
}

const renderApp = async (appPath: string, hot = false, props: ISSRProps) => {
	const ssrApp: TSSR = (hot ? hotRequire(appPath) : require(appPath)).default
	return ssrApp(props)
}
const renderHtml = async (
	indexHTMLPath: string,
	appContent?: string,
	stylesheet?: string
) => {
	const page = await getHtml(indexHTMLPath)
	if (stylesheet) {
		page("head").append(`<style type="text/css">${stylesheet}</style>`)
	}
	if (appContent) {
		page("#app").html(appContent)
	}

	return page.html()
}

interface ISSROptions {
	indexHTMLPath: string
	ssrAppPath: string
	hot?: boolean
}

export const render = ({
	indexHTMLPath,
	ssrAppPath,
	hot
}: ISSROptions): RequestHandler => async (req, res, next) => {
	let appContent: string
	let styleSheet: string
	const props: ISSRProps = {
		context: {},
		location: req.url
	}

	try {
		const renderResult = await renderApp(ssrAppPath, hot, props)
		appContent = renderResult.appContent
		styleSheet = renderResult.styleSheet
	} catch (error) {
		err(error)
		props.error = error
		props.context.statusCode = props.context.statusCode || 500

		try {
			const renderResult = await renderApp(ssrAppPath, hot, props)
			appContent = renderResult.appContent
			styleSheet = renderResult.styleSheet
		} catch (error) {
			next(error)
			return
		}
	}

	try {
		if (props.context.url) {
			res.redirect(props.context.url, props.context.statusCode || 302)
			return
		}

		const htmlContent = await renderHtml(indexHTMLPath, appContent, styleSheet)
		res.status(props.context.statusCode || 200).send(htmlContent)
	} catch (error) {
		next(error)
	}
}
