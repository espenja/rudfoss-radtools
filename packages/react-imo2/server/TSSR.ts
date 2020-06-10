import { StaticRouterContext } from "react-router"

export type ISSRContext = StaticRouterContext

export interface ISSRProps {
	context: ISSRContext
	location?: string
}

export type TSSR = (props: ISSRProps) => NodeJS.ReadableStream
