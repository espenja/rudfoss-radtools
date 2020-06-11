import { StaticRouterContext } from "react-router"
import { IAppProps } from "client/App"

export type ISSRContext = StaticRouterContext

export interface ISSRProps extends IAppProps {
	context: ISSRContext
	location?: string
}

export interface ISSROutput {
	context: ISSRContext
	appContent: string
	styleSheet: string
}

export type TSSR = (props: ISSRProps) => ISSROutput
