import { RequestHandler } from "express"
import { streamToString } from "utilities/node/streamToString"
import { readUTFFile } from "utilities/node/readFile"
import cheerio from "cheerio"
import { hotRequire } from "utilities/node/hotRequire"

const getHtml = async (htmlPath: string) => {
	const html = await readUTFFile(htmlPath)
	return cheerio.load(html)
}
const embedApp = (page: CheerioStatic, appContent: string) => {
	page("#app").html(appContent)
}

interface ISSROptions {
	indexHTMLPath: string
	ssrAppPath: string
	/**
	 * If true will hot-require the ssr root file.
	 */
	hot?: boolean
}

export const render = ({
	indexHTMLPath,
	ssrAppPath,
	hot
}: ISSROptions): RequestHandler => async (req, res, next) => {
	try {
		const ssrApp = (hot ? hotRequire(ssrAppPath) : require(ssrAppPath)).default
		const appContent = await streamToString(ssrApp())
		const page = await getHtml(indexHTMLPath)
		embedApp(page, appContent)
		const content = page.html()
		res.send(content)
	} catch (error) {
		next(error)
	}
}
