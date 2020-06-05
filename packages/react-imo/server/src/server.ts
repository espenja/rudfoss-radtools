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
import { generateCerts } from "utils/generateCerts"
import { setup } from "setup"

const secure = process.env.NODE_ENV !== "production"
const port = process.env.PORT || 3000

/**
 * Creates a new http(s) server. Will generate certificates if secure = true
 * @param listener The handler for incomming requests.
 * @param secure Whether to create a HTTPS server or not.
 */
const createServer = (listener: http.RequestListener, secure = false) =>
	secure
		? http.createServer(listener)
		: https.createServer(generateCerts(), listener)

const start = async () => {
	const server = express()
	await setup(server)

	const httpServer = createServer(server)
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
