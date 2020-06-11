import { RequestHandler, Request } from "express"
import { IRenderableError } from "./RenderableError"
import { ssrRender } from "./ssrRender"

export interface ISSRAppBaseState {
	/**
	 * If specified this error is passed to the application as a RenderableError instance which it
	 * in turn can do with as it wishes.
	 */
	error?: IRenderableError
}
export interface ISSRRequest<TAppState extends ISSRAppBaseState> {
	/**
	 * State information that will be rendered to the client when using SSR rendering.
	 * This state can be any type of object you specify.
	 */
	ssrState: TAppState
	ssrOptions: ISSRMiddlewareOptions
	/**
	 * Render the ssr page now.
	 * Calling this will return data to the client so you should not modify the response after calling this.
	 */
	ssrRender: typeof ssrRender
}

export type TSSRRequest<TAppState extends ISSRAppBaseState> = Request &
	ISSRRequest<TAppState>

export interface ISSRMiddlewareOptions {
	appRootFilePath: string
	indexHTMLPath: string
}

export const ssrMiddleware = (
	options: ISSRMiddlewareOptions
): RequestHandler => (req: any, res, next) => {
	const treq: TSSRRequest<any> = req
	treq.ssrState = {}
	treq.ssrOptions = options
	treq.ssrRender = () => ssrRender(req, res, next)
	next()
}
