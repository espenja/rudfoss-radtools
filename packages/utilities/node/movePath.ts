import fs from "fs"
import { promisify } from "util"

const fsRename = promisify(fs.rename)

export const movePath = async (from: string, to: string) => {
	return await fsRename(from, to)
}
