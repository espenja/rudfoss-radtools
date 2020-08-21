import appInsights from "applicationinsights"
import Transport from "winston-transport"
import { format } from "winston"
import { IRecordOfAny } from "utilities/ts/IRecordOfAny"
import safeStringify from "fast-safe-stringify"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ai = require("applicationinsights")

const getMessageSeverity = (winstonLevel: "debug" | "info" | "warning" | "error" | "crit") => {
	const levels = {
		crit: ai.Contracts.SeverityLevel.Critical,
		error: ai.Contracts.SeverityLevel.Error,
		warning: ai.Contracts.SeverityLevel.Warning,
		info: ai.Contracts.SeverityLevel.Information,
		debug: ai.Contracts.SeverityLevel.Verbose
	}

	return winstonLevel in levels ? levels[winstonLevel] : levels.info
}

/**
 * This class implements a transport for reporting winston logs to Application Insights. It requires an instance of the
 * AI client.
 * Messages containing metadata will be reported as `properties` within the message in AI. Some metadata may be
 * duplicated.
 */
export class AppInsightsTransport extends Transport {
	public client: appInsights.TelemetryClient

	public constructor(
		options: {
			client: appInsights.TelemetryClient
		} & Transport.TransportStreamOptions
	) {
		super(options)
		this.client = options.client || ai.defaultClient
	}

	public log(info: any, callback: () => void) {
		const { message, time, severity, requestId, operationId } = info
		if (severity === undefined) {
			console.error("You must add the formatter appInsightsFormatter")
			callback()
			return
		}

		const properties: any = {
			instance: requestId,
			category: "generic",
			operationId,
			...this.flattenData(info.data)
		}

		this.client.context.tags[this.client.context.keys.operationId] = info.operationId

		if (info.error) {
			this.client.trackException({
				time,
				exception: info.error,
				properties: { ...properties, message: info.message }
			})
		} else {
			this.client.trackTrace({
				time,
				severity,
				properties,
				message
			})
		}

		callback()
	}

	protected flattenData(data: IRecordOfAny = {}) {
		return Object.keys(data).reduce((acc, key) => {
			let entry = data[key]
			if (typeof entry === "object") {
				entry = safeStringify(entry)
			}
			acc[key] = entry
			return acc
		}, {} as any)
	}
}

/**
 * This formatter prepares a winston message for logging via Application Insights.
 * It is required if you are using the AppInsightsTransport transporter.
 */
export const appInsightsFormatter = format((info: any) => {
	if (info.requestId) {
		info.operationId = info.requestId
	}
	info.time = new Date(info.timestamp || Date.now())
	info.severity = getMessageSeverity(info.level)
	return info
})
