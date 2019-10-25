export interface IConfigChangeListenerOpts<TConfig, TSubConfig> {
	/**
	 * The path that triggered this listener.
	 */
	path: string
	/**
	 * The configuration object for the provided path.
	 */
	config: TSubConfig
	/**
	 * The full configuration object.
	 */
	fullConfig: TConfig
	/**
	 * The config reader instance that called the change listener.
	 * If a listener before this one is asynchronous the configuration object may have changed once this one is called.
	 * In these cases you can use the reader instance provided here to get the latest configuration.
	 */
	reader: IConfigReader<TConfig>
	/**
	 * Calling this function will unregister this notifier from its registered path preventing any new changes from calling
	 * it. Useful if you need a listener to only run for certain amount of time.
	 */
	off(): void
}
export type ConfigChangeListener<TConfig, TSubConfig> =
	(opts: IConfigChangeListenerOpts<TConfig, TSubConfig>) => any | Promise<any>

export interface IConfigPlaceholderHandlerOpts<TConfig> {
	/**
	 * The current configuration object so the placeholder may look up information.
	 * You should NOT modify this object in a placeholder handler. The value it returns will be set automatically.
	 */
	config: TConfig
	/**
	 * The key of the property or index in the array that contains a placeholder value.
	 */
	key: string | number
	/**
	 * The path including the key to the config entry with the placeholder.
	 */
	path: string
	/**
	 * The full value of the property including all placeholder data.
	 */
	value: string
	/**
	 * The value of the placeholder that triggered this handler.
	 */
	placeholder: string
	/**
	 * Each placeholder segment.
	 */
	segments: string[]
}
export type ConfigPlaceholderHandler<TConfig, TValue> =
	(opts: IConfigPlaceholderHandlerOpts<TConfig>) => TValue | Promise<TValue>

/**
 * Implements the read operations of a configurator.
 */
export interface IConfigReader<TConfig> {
	/**
	 * Returns the entire config object or a subtree if path is defined.
	 * If configuration manager is write protected a clone of the object is returned.
	 * @param path The path from the root of the object to return.
	 */
	get<TOutConfig = TConfig>(path?: string, defaultValue?: TOutConfig): TOutConfig

	/**
	 * Checks if the given path has a value other than undefined.
	 * @param path The path from the root config to check.
	 */
	has(path: string): boolean

	/**
	 * Creates a subscription for changes to a specific path that will notify the callback every time it is updated.
	 * @see off
	 * @param path The path to check.
	 * @param callback The function to call once the path updates.
	 */
	on(callback: ConfigChangeListener<TConfig, TConfig>): void
	on<TSubConfig>(path: string, callback: ConfigChangeListener<TConfig, TSubConfig>): void
	/**
	 * Removes a previously registered subscriber for updates to a specific path.
	 * @see on
	 * @param path The path the subscriber was registered for.
	 * @param callback The registered callback function to remove.
	 */
	off(callback: ConfigChangeListener<TConfig, TConfig>): void
	off<TSubConfig>(path: string, callback: ConfigChangeListener<TConfig, TSubConfig>): void
}

export interface IConfigWriter<TConfig> {
	/**
	 * Sets keys on the entire configuration object.
	 * @param config
	 * @returns A promise for the new configuration after it has been set.
	 */
	set(config: TConfig | any): Promise<TConfig>
	set<TSubConfig>(path: string, config: TSubConfig | any): Promise<TConfig>
}

export interface IConfigManager<TConfig> {
	/**
	 * Change the callback function that will be called upon every error that occurs during a set operation.
	 * @param error The error that occurred during the set operation.
	 */
	setOnSetError(callback: (error: Error) => void): void

	/**
	 * Set a handler that is called every time the defined placeholder string is encountered.
	 * If an existing handler is registered for this placeholder it is replaced.
	 * @param placeholder A case-sensitive name of the placeholder for this handler.
	 * @param handler The handler function to call when the placeholder is encountered.
	 */
	setPlaceholderHandler<TValue>(
		placeholder: string,
		handler: ConfigPlaceholderHandler<TConfig, TValue>
	): ConfigPlaceholderHandler<TConfig, TValue>
	/**
	 * Removes the placeholder handler registered for the provided placeholder if there is any.
	 * If no handler is registered the function simply returns.
	 * @param placeholder
	 */
	removePlaceholderHandler(placeholder: string): void
}
export interface IConfigSettings {
	/**
	 * A prefix string used to indicate that a config value is a placeholder
	 * @default "::"
	 */
	placeholderPrefix?: string
	/**
	 * If true calls to `get` will always return a deep clone of the configuration object.
	 * This can be used to guarantee that no unwarranted changes are made to the configuration object after it leaves
	 * the manager.
	 * @default false
	 */
	writeProtect?: boolean
	/**
	 * If set the manager will only allow one single listener to execute at once and wait for it to complete before
	 * notifying the next listener.
	 * @default false Async listeners are started, but the manager will not wait for them before calling additional
	 * listeners.
	 */
	waitForAsyncListeners?: boolean
	/**
	 * If true errors that occur in listeners will be thrown if there is not an onSetError handler specified.
	 * By default errors in listeners that are caught by the manager will be ignored if no onSetError handler is defined.
	 * @default false
	 */
	throwListenerErrors?: boolean
	/**
	 * If set any placeholder that does not have a registered placeholder handler defined will be ignored instead of
	 * throwing an error.
	 * @default false
	 */
	ignoreUnknownPlaceholders?: boolean
	/**
	 * Set the default error handler to call should an error occur within the `set` pipeline.
	 * @param error
	 */
	onSetError?(error: Error): void
}
