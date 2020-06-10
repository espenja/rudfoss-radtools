import { RequestHandler } from "express"
import { streamToString } from "utils/node/streamToString"
import { readUTFFile } from "utils/node/readFile"
import cheerio from "cheerio"
import chokidar, { FSWatcher } from "chokidar"

const getHtml = async (htmlPath: string) => {
	const html = await readUTFFile(htmlPath)
	return cheerio.load(html)
}
const embedApp = (page: CheerioStatic, appContent: string) => {
	page("#app").html(appContent)
}

const watchers: Map<string, FSWatcher> = new Map()
const hotReload = (path: string) => {
	if (watchers.has(path)) {
		return
	}

	console.log(`Watching "${path}"`)
	const watcher = chokidar.watch(path, { persistent: true })
	watcher.on("change", () => {
		console.log(`Invalidating "${path}"`)
		delete require.cache[path]
	})
	watchers.set(path, watcher)
}

interface ISSROptions {
	indexHTMLPath: string
	ssrAppPath: string
}

export const render = ({
	indexHTMLPath,
	ssrAppPath
}: ISSROptions): RequestHandler => async (req, res, next) => {
	try {
		hotReload(ssrAppPath)
		const ssrApp = require(ssrAppPath).default
		const appContent = await streamToString(ssrApp())
		const page = await getHtml(indexHTMLPath)
		embedApp(page, appContent)
		const content = page.html()
		res.send(content)
	} catch (error) {
		next(error)
	}
}
