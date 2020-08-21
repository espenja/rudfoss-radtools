import chokidar, { FSWatcher } from "chokidar"
import debug from "debug"

const log = debug("hotRequire")
log.log = console.log.bind(console)

const watchers: Map<string, FSWatcher> = new Map()

// Hack to get proper require while using webpack. Ref: https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
declare const __non_webpack_require__: typeof require
const __safeRequire = typeof __non_webpack_require__ === "function" ? __non_webpack_require__ : require

/**
 * Works like require, but will invalidate the cached file if it changes so that subsequent calls will have to reload it.
 * @param path The exact path to load (must include extension)
 */
export const hotRequire = (path: string) => {
	if (!watchers.has(path)) {
		const watcher = chokidar.watch(path)
		log(`require ${path}`)
		watcher.on("change", () => {
			if (__safeRequire.cache[path]) {
				log(`flush ${path}`)
				delete __safeRequire.cache[path]
			}
		})
		watchers.set(path, watcher)
	}

	return __safeRequire(path)
}
