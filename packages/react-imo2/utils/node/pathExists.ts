import fs from "fs"
import { promisify } from "util"

const fsExists = promisify(fs.exists)
const fsLstat = promisify(fs.lstat)

export type TPathType = "file" | "directory" | "any"

/**
 * Checks if the path exists.
 * @param path The path to check.
 * @param type The type of path to look for.
 */
export const pathExists = async (path: string, type: TPathType = "any") => {
	if (!(await fsExists(path))) return false
	const stats = await fsLstat(path)
	if (type === "file" && stats.isDirectory()) return false
	if (type === "directory" && stats.isFile()) return false

	return true
}

/**
 * Returns the first path that exists
 * @param paths
 * @param type
 */
export const firstPathExists = async (
	paths: string[] | Array<[string, TPathType]>,
	type: TPathType = "any"
) => {
	for (const pathEntry of paths) {
		const path = Array.isArray(pathEntry) ? pathEntry[0] : pathEntry
		const realType = Array.isArray(pathEntry) ? pathEntry[1] : type
		if (!(await pathExists(path, realType))) continue
		return path
	}

	return undefined
}
