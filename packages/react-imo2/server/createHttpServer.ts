import { Application } from "express"
import path from "path"
import http from "http"
import https from "https"

import { generateCerts } from "utils/generateCerts"
import { pathExists } from "utils/node/pathExists"
import { readUTFFile } from "utils/node/readFile"
import { ensureDir } from "utils/node/ensureDir"
import { writeUTFFile } from "utils/node/writeFile"

const getCertificates = async (
	cacheDir?: string
): Promise<{ key: string; cert: string }> => {
	if (!cacheDir) {
		return generateCerts()
	}

	const keyPath = path.resolve(cacheDir, "key.pem")
	const certPath = path.resolve(cacheDir, "cert.pem")
	if (
		(await pathExists(keyPath, "file")) &&
		(await pathExists(certPath, "file"))
	) {
		const key = await readUTFFile(keyPath)
		const cert = await readUTFFile(certPath)
		return { key, cert }
	}

	const keyPair = generateCerts()
	await ensureDir(cacheDir)
	await writeUTFFile(keyPath, keyPair.key)
	await writeUTFFile(certPath, keyPair.cert)
	return keyPair
}

interface ICreateHTTPServerOptions {
	expressApp: Application
	secure?: boolean
	port?: string | number
	/**
	 * Whether to regenerate certificates on every restart or cache them to avoid multiple warnings in browsers.
	 * @default true
	 */
	cacheCert?: boolean
}

const defaultOptions = (
	options: ICreateHTTPServerOptions
): Required<Pick<ICreateHTTPServerOptions, "secure" | "port" | "cacheCert">> &
	ICreateHTTPServerOptions => ({
	secure: false,
	port: process.env.PORT || 3000,
	cacheCert: true,
	...options
})

export const createHttpServer = async (options: ICreateHTTPServerOptions) => {
	const { expressApp: express, secure, port, cacheCert } = defaultOptions(
		options
	)
	const certDir = cacheCert ? path.resolve(__dirname, "./.cache") : undefined
	const server = secure
		? https.createServer(await getCertificates(certDir), express)
		: http.createServer(express)

	return new Promise((resolve, reject) => {
		try {
			server.on("error", reject)
			server.on("listening", resolve)
			server.listen(port)
		} catch (error) {
			reject(error)
		}
	})
}
