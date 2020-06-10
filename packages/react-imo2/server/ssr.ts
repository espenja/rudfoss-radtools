import { RequestHandler } from "express"
import { streamToString } from "utils/node/streamToString"
import { readUTFFile } from "utils/node/readFile"
import cheerio from "cheerio"

const getHtml = async (htmlPath: string) => {
	const html = await readUTFFile(htmlPath)
	return cheerio.load(html)
}
const embedApp = (page: CheerioStatic, appContent: string) => {
	page("#app").html(appContent)
}

interface ISSROptions {
	indexHTMLPath: string
	ssrAppRender: () => NodeJS.ReadableStream
}

export const render = ({
	indexHTMLPath,
	ssrAppRender
}: ISSROptions): RequestHandler => async (req, res, next) => {
	try {
		const appContent = await streamToString(ssrAppRender())
		const page = await getHtml(indexHTMLPath)
		embedApp(page, appContent)
		const content = page.html()
		res.send(content)
	} catch (error) {
		next(error)
	}
}
