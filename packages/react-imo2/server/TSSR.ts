import { StaticRouterContext } from "react-router"

export type ISSRContext = StaticRouterContext

export interface ISSRProps {
	forceError?: boolean
	context: ISSRContext
	location?: string
}

export type TSSR = (props: ISSRProps) => string
