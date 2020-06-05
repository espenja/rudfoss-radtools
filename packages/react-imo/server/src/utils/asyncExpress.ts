import { NextFunction, Request, Response } from "express"

/**
 * Defines a potentially async request handler that can potentially return a value to the client.
 */
export type AsyncRequestHandler<
	TResponseBody = any,
	TRequest extends Request = Request,
	TResponse extends Response = Response
> = (req: TRequest, res: TResponse) => TResponseBody | Promise<TResponseBody>

/**
 * Defines a potentially async middleware that is not allowed to return anything.
 * `next()` is called automatically.
 */
export type AsyncMiddleware = AsyncRequestHandler<void>

/**
 * Creates a normal express request handler from an async function.
 * If the function returns anything it is sent to the client.
 * If the function returns explicit `undefined` the next handler in the chain is called (useful for middlewares).
 * If the function throws the normal express error handling chain is processed.
 *
 * The handler is not allowed to call next (and is in fact not even given the opportunity to do so).
 * @param handler
 */
export const asyncHandler = <
	TResponseBody = any,
	TRequest extends Request = Request,
	TResponse extends Response = Response
>(
	handler: AsyncRequestHandler<TResponseBody, TRequest, TResponse>
) => async (req: TRequest, res: TResponse, next: NextFunction) => {
	try {
		const handlerResponse = await handler(req, res)
		if (handlerResponse === undefined) {
			next()
		}
	} catch (error) {
		next(error)
	}
}
