export interface IConfigReader<TConfig> {
	/**
	 * Get the current, complete configuration object.
	 * Every time this is called it returns a copy of the configuration object.
	 * This ensures that no accidental modification is propagated.
	 */
	get(): TConfig
	/**
	 * Returns a subset of the configuration object based on the path.
	 * Like `get()` this also returns a copy of the configuration object.
	 * @param path The path from the root config to find.
	 */
	get<TSubConfig>(path: string): TSubConfig

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
	on<TSubConfig>(path: string, callback: (config: TSubConfig, reader: this) => any): void
	/**
	 * Removes a previously registered subscriber for updates to a specific path.
	 * @see on
	 * @param path The path the subscriber was registered for.
	 * @param callback The registered callback function to remove.
	 */
	off<TSubConfig>(path: string, callback: (config: TSubConfig, reader: this) => any): void
}

export interface IConfigWriter<TConfig> {
	/**
	 * Sets keys on the entire configuration object. Keys are merged using
	 * @param config
	 */
	set(config: TConfig): TConfig
	set<TSubConfig>(path: string, config: TSubConfig): TSubConfig
}
