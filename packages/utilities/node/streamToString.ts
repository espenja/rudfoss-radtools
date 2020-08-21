/**
 * Reads a node ReadableStream to a string.
 * @param readableStream
 */
export const streamToString = async (readableStream: NodeJS.ReadableStream): Promise<string> => {
	return new Promise((resolve, reject) => {
		const chunks: string[] = []
		readableStream.on("data", (data) => {
			chunks.push(data.toString())
		})
		readableStream.on("end", () => {
			resolve(chunks.join(""))
		})
		readableStream.on("error", reject)
	})
}

/**
 * Reads a node ReadableStream and parses it as JSON.
 * @param readableStream
 */
export const streamToJson = async <TJsonType = any>(readableStream: NodeJS.ReadableStream): Promise<TJsonType> => {
	const stringValue = await streamToString(readableStream)
	return JSON.parse(stringValue)
}
