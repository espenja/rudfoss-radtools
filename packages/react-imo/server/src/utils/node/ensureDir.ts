import { pathExists } from "./pathExists"
import { mkdirp } from "fs-extra"

/**
 * Creates the path if it does not exist. Returns the fullPath.
 * @param fullPath
 */
export const ensureDir = async (fullPath: string) => {
	if (!(await pathExists(fullPath, "directory"))) {
		await mkdirp(fullPath)
	}
	return fullPath
}
