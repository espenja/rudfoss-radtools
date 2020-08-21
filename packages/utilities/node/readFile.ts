import fs from "fs"
import { promisify } from "util"
import chardet from "chardet"

/**
 * Reads the contents of a UTF8 file as string.
 * @param path
 */
export const readUTFFile = async (path: string) => promisify(fs.readFile)(path, "UTF8")

/**
 * Reads a UTF JSON file and parses the content. Typecasts the result to the generic specified.
 * @param path
 */
export const readJson = async <TType = any>(path: string): Promise<TType> => JSON.parse(await readUTFFile(path)) as any

/**
 * Reads the text content of a file and tries to detect the encoding.
 * Should work for most UTF and ISO formats.
 * @param path
 */
export const readFile = async (path: string) => {
	const fileEncoding = await chardet.detectFile(path)
	if (!fileEncoding) throw new Error("Unable to automatically determine file encoding")
	return promisify(fs.readFile)(path, fileEncoding?.toString())
}
