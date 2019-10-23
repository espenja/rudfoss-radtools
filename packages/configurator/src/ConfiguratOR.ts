import clone from "lodash/clone"
import cloneDeep from "lodash/cloneDeep"
import get from "lodash/get"
import setWith from "lodash/setWith"
import PlaceholderError from "./errors/PlaceholderError"
import {
	ConfigChangeListener,
	ConfigPlaceholderHandler,
	IConfigChangeListenerOpts,
	IConfigManager,
	IConfigReader,
	IConfigSettings,
	IConfigWriter
} from "./interfaces/IConfigurator"
import processPlaceholderHandlers from "./utils/processPlaceholderHandlers"

const waitForCleanStack = async (delayMS: number = 0) => new Promise((res) => setTimeout(() => res(), delayMS))

export const DEFAULT_CONFIGURATOR_SETTINGS: Required<Omit<IConfigSettings, "onSetError">> = {
	placeholderPrefix: "::",
	throwListenerErrors: false,
	waitForAsyncListeners: false,
	writeProtect: false,
	ignoreUnknownPlaceholders: false
}

/**
 * The ConfiguratOR class manages a config object for you throughout the lifetime of your application.
 */
export class ConfiguratOR<TConfig = any> implements
	IConfigReader<TConfig>, IConfigWriter<TConfig>, IConfigManager<TConfig> {
	private _configObject: any = {}

	private _listeners: {
		"*": Array<ConfigChangeListener<TConfig, any>>
		[key: string]: Array<ConfigChangeListener<TConfig, any>>
	} = {
		"*": []
	}
	private _setterQueue: Array<{
		path: string
		change: any
	}> = []
	private _placeholderHandlers: {
		[key: string]: ConfigPlaceholderHandler<TConfig, any>
	} = {}

	private _settings: IConfigSettings & Required<Omit<IConfigSettings, "onSetError">>

	private _queueProcessPromise?: Promise<TConfig>
	private _isProcessingSetterQueue = false
	private _receivedNewSettersWhileProcessingSetterQueue = false

	public constructor(settings: IConfigSettings = {}) {
		this._settings = {
			...DEFAULT_CONFIGURATOR_SETTINGS,
			...settings
		}
	}

	public get<TOutConfig = TConfig>(path?: string, defaultValue?: TOutConfig): TOutConfig {
		const config = !path || path === "*" ? this._configObject : get(this._configObject, path, defaultValue)
		return this._settings.writeProtect ? cloneDeep(config) : config
	}
	public has(path: string) {
		return get(this._configObject, path) !== undefined
	}

	public set(config: TConfig | any): Promise<TConfig>
	public set<TSubConfig>(path: string, config: TSubConfig | any): Promise<TConfig>
	public set<TSubConfig>(path: string | TSubConfig | any, config?: TSubConfig | any): Promise<TConfig> {
		const realPath = typeof path === "string" ? path : "*"
		const realConfig = !!config ? config : path
		this._setterQueue = this._setterQueue.concat([{
			path: realPath,
			change: realConfig
		}])
		return this._scheduleSetterQueueProcessing()
	}

	public on(callback: ConfigChangeListener<TConfig, TConfig>): void
	public on<TSubConfig>(path: string, callback: ConfigChangeListener<TConfig, TSubConfig>): void
	public on<TSubConfig>(
		path: string | ConfigChangeListener<TConfig, TSubConfig>,
		callback?: ConfigChangeListener<TConfig, TSubConfig>) {
		const realPath = typeof path === "string" ? path : "*"
		const newListener = !callback ? path as ConfigChangeListener<TConfig, TSubConfig> : callback
		const listeners = this._listeners[realPath] || []
		this._listeners = {
			...this._listeners,
			[realPath]: listeners.concat([newListener])
		}
	}
	public off(callback: ConfigChangeListener<TConfig, TConfig>): void
	public off<TSubConfig>(path: string, callback: ConfigChangeListener<TConfig, TSubConfig>): void
	public off<TSubConfig>(
		path: string | ConfigChangeListener<TConfig, TSubConfig>,
		callback?: ConfigChangeListener<TConfig, TSubConfig>) {
		const realPath = typeof path === "string" ? path : "*"
		const listenerToRemove = !callback ? path as ConfigChangeListener<TConfig, TSubConfig> : callback
		const listeners = this._listeners[realPath] || []
		const newListeners = listeners.filter((aListener) => aListener !== listenerToRemove)
		this._listeners = {
			...this._listeners,
			[realPath]: newListeners
		}
	}

	public setPlaceholderHandler<TValue>(placeholder: string, handler: ConfigPlaceholderHandler<TConfig, TValue>) {
		this._placeholderHandlers[placeholder] = handler
	}
	public removePlaceholderHandler(placeholder: string) {
		delete this._placeholderHandlers[placeholder]
	}

	public setOnSetError(callback: (error: Error) => void) {
		this._settings.onSetError = callback
	}

	private _scheduleSetterQueueProcessing() {
		if (this._setterQueue.length === 0) return new Promise<TConfig>((resolve) => resolve(this.get()))

		if (this._queueProcessPromise) {
			if (this._isProcessingSetterQueue) {
				this._receivedNewSettersWhileProcessingSetterQueue = true
			}
			return this._queueProcessPromise
		}

		return this._queueProcessPromise = this._handleSetterQueue().finally(() => {
			this._queueProcessPromise = undefined
			if (this._receivedNewSettersWhileProcessingSetterQueue) {
				this._receivedNewSettersWhileProcessingSetterQueue = false
				this._scheduleSetterQueueProcessing()
			}
		})
	}

	private async _notifyListeners(
		oldConfig: TConfig,
		newConfig: TConfig,
		listenerSet: {
			"*": Array<ConfigChangeListener<TConfig, any>>
			[key: string]: Array<ConfigChangeListener<TConfig, any>>
		}) {
		try {
			for (const [path, listeners] of Object.entries(listenerSet)) {
				if (listeners.length === 0) continue

				const oldLocalConfig = path === "*" ? oldConfig : get(oldConfig, path)
				const newLocalConfig = path === "*" ? newConfig : get(newConfig, path)
				if (oldLocalConfig !== newLocalConfig) {
					const opts: Omit<IConfigChangeListenerOpts<TConfig, any>, "off"> = {
						config: newLocalConfig,
						fullConfig: newConfig,
						path,
						reader: this
					}
					for (const listener of listeners) {
						const fullOpts: IConfigChangeListenerOpts<TConfig, any> = {
							...opts,
							off: () => this.off(path, listener)
						}
						this._settings.waitForAsyncListeners ? await listener(fullOpts) : listener(fullOpts)
					}
				}
			}
		} catch (error) {
			if (this._settings.onSetError) {
				this._settings.onSetError(error)
			} else {
				if (this._settings.throwListenerErrors) {
					throw error
				}
			}
		}
	}
	private async _handleSetterQueue(): Promise<TConfig> {
		await waitForCleanStack()
		this._isProcessingSetterQueue = true

		try {
			// Create local copies of data to prevent runtime changes
			const setterQueue = this._setterQueue
			this._setterQueue = [] // Reset setter queue so future sets will be added correctly.
			const listenerSet = cloneDeep(this._listeners)
			const oldConfig = this._configObject

			if (setterQueue.length === 0) return this.get()

			// Deep merge with cloning
			let newConfig = oldConfig
			for (const setter of setterQueue) {
				if (setter.path === "*") {
					newConfig = {
						...newConfig,
						...setter.change
					}
					continue
				}
				newConfig = setWith(clone(newConfig), setter.path, setter.change, clone)
			}

			// Process all placeholders
			try {
				newConfig = await processPlaceholderHandlers(
					newConfig,
					this._settings.ignoreUnknownPlaceholders,
					this._placeholderHandlers,
					this._settings.placeholderPrefix)
			} catch (error) {
				const placeholderError = PlaceholderError.Wrap(error)
				if (this._settings.onSetError) {
					this._settings.onSetError(placeholderError)
				} else {
					throw placeholderError
				}
			}

			// Apply configuration object globally
			this._configObject = newConfig

			// Notify listeners
			await this._notifyListeners(oldConfig, newConfig, listenerSet)

			// Finally return completed config and resolving the promise
			return this.get()
		} finally {
			this._isProcessingSetterQueue = false
		}
	}
}

export default ConfiguratOR
