import { NextFunction, Request, Response } from "express"

/**
 * Defines a potentially async request handler that can potentially return a value to the client.
 */
export type AsyncRequestHandler<
	TRequest extends Request = Request,
	TResponse extends Response = Response,
	TResponseBody = any
> = (req: TRequest, res: TResponse) => TResponseBody | Promise<TResponseBody>

/**
 * Defines a potentially async middleware that is not allowed to return anything.
 * `next()` is called automatically.
 */
export type AsyncMiddleware<
	TRequest extends Request = Request,
	TResponse extends Response = Response
> = AsyncRequestHandler<TRequest, TResponse, void>

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
	TRequest extends Request = Request,
	TResponse extends Response = Response,
	TResponseBody = any
>(
	handler: AsyncRequestHandler<TRequest, TResponse, TResponseBody>
) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		const handlerResponse = await handler(req as TRequest, res as TResponse)
		if (handlerResponse === undefined) {
			next()
			return
		}
		res.send(handlerResponse)
	} catch (error) {
		next(error)
	}
}
