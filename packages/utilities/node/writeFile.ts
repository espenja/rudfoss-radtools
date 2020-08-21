import fs from "fs"
import { promisify } from "util"

/**
 * Writes content to a UTF8 file without BOM.
 * @param path
 */
export const writeUTFFile = async (
	path: string,
	content: string,
	options: fs.WriteFileOptions = { encoding: "utf-8" }
) => promisify(fs.writeFile)(path, content, options)
