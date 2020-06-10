import { RequestHandler, Request } from "express"
import { readUTFFile } from "utilities/node/readFile"
import cheerio from "cheerio"
import { hotRequire } from "utilities/node/hotRequire"
import { TSSR, ISSRContext } from "./TSSR"

import { logger } from "utils/logger"
const { log, err } = logger("ssr")

const getHtml = async (htmlPath: string) => {
	const html = await readUTFFile(htmlPath)
	return cheerio.load(html)
}
const embedApp = (page: CheerioStatic, appContent: string) => {
	page("#app").html(appContent)
}

const renderApp = async (req: Request, appPath: string, hot = false) => {
	const ssrApp: TSSR = (hot ? hotRequire(appPath) : require(appPath)).default
	const context: ISSRContext = {}
	let appContent = ""

	try {
		appContent = ssrApp({ context, location: req.url })
	} catch (error) {
		err(error)
		appContent = ssrApp({ context, location: req.url, forceError: true })
	}

	return {
		context,
		appContent
	}
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
	try {
		log(`SSR app (${hot ? "hot" : "cold"}) ${ssrAppPath}`)
		const { appContent, context } = await renderApp(req, ssrAppPath, hot)
		if (context.url) {
			res.redirect(context.url)
			return
		}

		const page = await getHtml(indexHTMLPath)
		embedApp(page, appContent)
		const content = page.html()

		const status = context.statusCode || 200
		log(`SSR Response ${status} ${req.url}`)
		res.status(status).send(content)
	} catch (error) {
		next(error)
	}
}
