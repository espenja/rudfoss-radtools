import React from "react"
import { RouteComponentProps } from "react-router-dom"

export const NotFound: React.FC<RouteComponentProps> = ({
	staticContext = {}
}) => {
	staticContext.statusCode = 404
	return <h3>Route not found</h3>
}

export default NotFound
