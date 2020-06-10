import { StaticRouterContext } from "react-router"

export type ISSRContext = StaticRouterContext

export interface ISSRProps {
	serverError?: boolean
	clientError?: boolean
	context: ISSRContext
	location?: string
}

export type TSSR = (props: ISSRProps) => string
