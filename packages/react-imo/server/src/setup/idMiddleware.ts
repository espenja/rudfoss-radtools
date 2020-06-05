import { nanoid } from "nanoid"
import { AsyncMiddleware } from "utils/asyncExpress"

export interface IIDMiddlewareRequest {
	id: string
}

/**
 * A tiny middleware that adds an ID to the request for reference such as logging.
 */
export const idMiddleware: AsyncMiddleware = (req: any) => {
	req.id = nanoid()
}
