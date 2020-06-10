import fs from "fs"
import { promisify } from "util"

/**
 * Reads the contents of a UTF8 file as string.
 * @param path
 */
export const readUTFFile = async (path: string) =>
	promisify(fs.readFile)(path, "utf8")

export const readJson = async <TType = any>(path: string): Promise<TType> =>
	JSON.stringify(await readUTFFile(path)) as any

export const readJsonWithComments = async <TType = any>(
	path: string
): Promise<TType> => {
	const content = await readUTFFile(path)
	let jsonContent: any
	eval(`jsonContent = ${content}`)
	return jsonContent
}
