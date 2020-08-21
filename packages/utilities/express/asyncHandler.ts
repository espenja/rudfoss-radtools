import { NextFunction, Request, Response, RequestHandler } from "express"

export type TRequestHandler<TRequest = Request, TResponse = Response, TNextFunction = NextFunction> = (
	req: TRequest,
	res: TResponse,
	next: TNextFunction
) => any | Promise<any>

/**
 * Wrapper for creating middleware or handlers with strongly typed parameters.
 * The wrapper usually deals with calling next as well as sending the response,
 * but there are a few exceptions where the wrapped handler needs control over
 * when and how next is called:
 * - Returning `undefined` or `Promise<undefined>` causes `next` to be called without any arguments (passing along control).
 * - Returning `false` results in no handling from the wrapper. Use this if you want complete control over the control flow.
 * - Returning any other value or a promise for any other value results in `res.send(value)`. You can modify the response as normal e.g.: `res.status(401)` before returning.
 * - Throwing an error, returning a rejected promise or calling `next(error)` explicitly causes normal express error handling to be invoked using `next(error)`
 * @param handler
 */
export const asyncMiddleware = <TRequest = Request, TResponse = Response, TNextFunction = NextFunction>(
	handler: TRequestHandler<TRequest, TResponse, TNextFunction>
): RequestHandler => (req, res, next) => {
	const nextProxy: {
		(arg?: any): void
		called?: boolean
		arg?: any
	} = (arg) => {
		nextProxy.called = true
		nextProxy.arg = arg
	}

	try {
		const response = handler(req as any, res as any, next as any)
		if (response === false) {
			return
		}

		if (response !== undefined) {
			if (typeof response === "object" && response.then) {
				response
					.then((data: any) => {
						if (data === undefined) {
							next()
							return
						}
						if (data === false) {
							return
						}
						res.send(data)
					})
					.catch((error: any) => {
						if (nextProxy.called) {
							next(nextProxy.arg)
							return
						}
						next(error)
					})
				return
			}

			res.send(response)
			return
		}
		if (nextProxy.called) {
			next(nextProxy.arg)
			return
		}
		next()
	} catch (error) {
		if (nextProxy.called) {
			next(nextProxy.arg)
			return
		}
		next(error)
	}
}
