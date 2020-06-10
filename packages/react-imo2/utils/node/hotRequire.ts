import chokidar, { FSWatcher } from "chokidar"

const watchers: Map<string, FSWatcher> = new Map()

/**
 * Works like require, but will invalidate the cached file if it changes so that subsequent calls will have to reload it.
 * @param path The exact path to load (must include extension)
 */
export const hotRequire = (path: string) => {
	if (!watchers.has(path)) {
		const watcher = chokidar.watch(path)
		watcher.on("change", () => {
			delete require.cache[path]
		})
		watchers.set(path, watcher)
	}

	return require(path)
}
