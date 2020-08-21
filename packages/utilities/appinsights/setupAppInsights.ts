// eslint-disable-next-line @typescript-eslint/no-var-requires
const ai = require("applicationinsights")
import { TelemetryClient } from "applicationinsights"

export type IAppInsightsConfiguration = {
	autoCollectConsole?: boolean
	autoCollectExceptions?: boolean
	autoCollectPerformance?: boolean
	autoCollectRequests?: boolean
	autoCollectDependencies?: boolean
	autoDependencyCorrelation?: boolean
	useDiskRetryCaching?: boolean
	internalLogging?: {
		enableDebugLogging: boolean
		enableWarningLogging: true
	}
	sendLiveMetrics?: boolean
	samplingPercentage?: number
}

const defaultValues = (config: IAppInsightsConfiguration = {}): IAppInsightsConfiguration => ({
	autoCollectConsole: false,
	autoCollectExceptions: true,
	autoCollectPerformance: true,
	autoCollectRequests: true,
	autoCollectDependencies: true,
	autoDependencyCorrelation: true,
	useDiskRetryCaching: true,
	internalLogging: {
		enableDebugLogging: false,
		enableWarningLogging: true
	},
	sendLiveMetrics: true,
	samplingPercentage: 100,
	...config
})

/**
 *	Creates an Application Insight logger client using the default configuration.
 *	Function is set up with default configuration, but can be changed by using the config parameter.
 *
 * The default configuration is:
 * ```
{
  autoCollectConsole: false,
  autoCollectExceptions: true,
  autoCollectPerformance: true,
  autoCollectRequests: true,
  autoCollectDependencies: true,
  autoDependencyCorrelation: true,
  useDiskRetryCaching: true,
  internalLogging: {
    enableDebugLogging: false,
    enableWarningLogging: true
  },
  sendLiveMetrics: true,
	samplingPercentage: 100,
	...config // Your configuration is added here.
}
	```
 * @param config Any configurations to override in the default configuration. Overrides are expanded onto the default object using (...)
 * @param setupString the Connection String or Instrumentation Key to use. Optional, if this is not specified, the value will be read from the environment
 * variable APPLICATIONINSIGHTS_CONNECTION_STRING or APPINSIGHTS_INSTRUMENTATIONKEY.
 * @returns TelemetryClient
 */
export const setupAppInsights = (config: IAppInsightsConfiguration = {}, setupString?: string): TelemetryClient => {
	const defaultConfig = defaultValues(config)

	const coreClient = ai
		.setup(setupString)
		.setAutoCollectConsole(defaultConfig.autoCollectConsole)
		.setAutoCollectExceptions(defaultConfig.autoCollectExceptions)
		.setAutoCollectPerformance(defaultConfig.autoCollectPerformance)
		.setAutoCollectRequests(defaultConfig.autoCollectRequests)
		.setAutoCollectDependencies(defaultConfig.autoCollectDependencies)
		.setAutoDependencyCorrelation(defaultConfig.autoDependencyCorrelation)
		.setUseDiskRetryCaching(defaultConfig.useDiskRetryCaching)
		.setInternalLogging(
			defaultConfig.internalLogging?.enableDebugLogging,
			defaultConfig.internalLogging?.enableWarningLogging
		)
		.setSendLiveMetrics(defaultConfig.sendLiveMetrics)

	const aiClient = ai.defaultClient
	aiClient.config.samplingPercentage = defaultConfig.samplingPercentage
	coreClient.start()

	console.log(`AppInsights "${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}" configured`)

	return aiClient
}
