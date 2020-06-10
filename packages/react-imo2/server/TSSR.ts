import { StaticRouterContext } from "react-router"
import { GenerateId, SheetsRegistry } from "jss"

export type ISSRContext = StaticRouterContext

export interface ISSRProps {
	serverError?: boolean
	clientError?: boolean
	context: ISSRContext
	location?: string
	sheets: SheetsRegistry
	generateId: GenerateId
}

export type TSSR = (props: ISSRProps) => string
