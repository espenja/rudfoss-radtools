import appInsights from "applicationinsights"
import { createLogger, format, transports } from "winston"
import { AppInsightsTransport, appInsightsFormatter } from "./AppInsightsTransport"
import safeStringify from "fast-safe-stringify"

const formatDataPayload = format((info: any) => {
	if (info.data) {
		info.data = safeStringify(info.data)
	}
	if (info.error) {
		info.message = `${info.message} : ${info.error.message} ${info.error.stack || "[]"}`
	}
	return info
})
const formatAugmentMessageWithData = format((info: any) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { level, message, ...rest } = info
	info.message = `${message} ${safeStringify(rest)}`
	return info
})

/**
 * Creates a new Winston logger configured to log to Application Insights via an Application Insights TelemetryClient
 * @param {appInsights.TelemetryClient} client
 * @returns
 */
export const newWinstonAILogger = (client: appInsights.TelemetryClient) => {
	const logger = createLogger({
		level: "debug",
		format: format.combine(format.timestamp(), formatDataPayload(), appInsightsFormatter()),
		transports: [
			new AppInsightsTransport({ client, level: "debug" }),
			new transports.Console({
				format: format.combine(formatAugmentMessageWithData(), format.cli())
			})
		]
	})

	return logger
}
