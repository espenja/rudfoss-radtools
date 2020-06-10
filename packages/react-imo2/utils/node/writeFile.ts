import fs from "fs"
import { promisify } from "util"

/**
 * Writes content toa UTF8 file without BOM
 * @param path
 */
export const writeUTFFile = async (path: string, content: string) =>
	promisify(fs.writeFile)(path, content, { encoding: "utf8" })
