/**
 * This file sets up the server. There should not be a need to modify it, but you are of course free to do so.
 * Configuration of express should be done in the setup file instead to separate out the routes and middleware
 * from the initial setup.
 *
 * This file does a few things:
 * - It determines which port to use from an environment variable `PORT`
 * - It sets up an HTTPS development server if `NODE_ENV` is not equal to `production`
 *
 * The intention of this file is to set up the underlying server settings. Express configurations such as
 * middleware, settings and routes belong in `setup.ts`.
 */

import express from "express"

import http from "http"
import https from "https"
import path from "path"

import setup from "./setup"
import { generateCerts } from "utils/generateCerts"
import { ensureDir } from "utils/node/ensureDir"
import { pathExists } from "utils/node/pathExists"
import { readUTFFile } from "utils/node/readFile"
import { writeUTFFile } from "utils/node/writeFile"

const secure = process.env.NODE_ENV !== "production"
const port = process.env.PORT || 3000
process.env.ROOT_DIR = __dirname

const createSecureServer = async (listener: http.RequestListener) => {
	const cacheDir = path.resolve(__dirname, "../.cache")
	const keyPath = path.resolve(cacheDir, "key.pem")
	const certPath = path.resolve(cacheDir, "cert.pem")

	let key = ""
	let cert = ""
	if (
		!(await pathExists(keyPath, "file")) ||
		!(await pathExists(certPath, "file"))
	) {
		console.log(`No certs found in "${cacheDir}". Must generate.`)
		await ensureDir(cacheDir)
		const keyCert = generateCerts()
		key = keyCert.key
		cert = keyCert.cert
		await writeUTFFile(keyPath, key)
		await writeUTFFile(certPath, cert)
		console.log(`Generated key key "${keyPath}" and cert "${certPath}"`)
	} else {
		key = await readUTFFile(keyPath)
		cert = await readUTFFile(certPath)
	}

	return https.createServer({ key, cert }, listener)
}

/**
 * Creates a new http(s) server. Will generate certificates if secure = true
 * @param listener The handler for incomming requests.
 * @param secure Whether to create a HTTPS server or not.
 */
const createServer = async (listener: http.RequestListener, secure = false) =>
	secure ? http.createServer(listener) : await createSecureServer(listener)

const start = async () => {
	console.log("START SERVER")

	const server = express()
	await setup(server)

	const httpServer = await createServer(server)
	httpServer.listen(port, () => {
		console.log(
			`Server listening @ ${secure ? "https" : "http"}://localhost:${port}`
		)
	})
}

start().catch((error) => {
	console.error(error)
	process.exit(1)
})
