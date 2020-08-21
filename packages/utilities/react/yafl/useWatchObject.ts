import { useCallback, useRef } from "react"

/**
 * Defines an object that can be observed for changes.
 */
export type WatcherObject<TPropertyType = any> = {
	[key: string]: TPropertyType
}
/**
 * Defines a function that can receive updates once one ore more properties change.
 */
export type WatcherUpdater<TPropertyType = any> = (
	newValues: WatcherObject<TPropertyType>,
	watchedProps?: string[]
) => unknown

/**
 * Creates a set of helper functions for monitoring and updating an object containing properties.
 * Updates to the object will not trigger any re-render thus improving performance.
 */
export const useWatchObject = <TPropertyType>(
	initialValues: WatcherObject<TPropertyType> = {}
) => {
	/**
	 * The live value object to assign listeners for.
	 */
	const valueObject = useRef<WatcherObject<TPropertyType>>({ ...initialValues })

	/**
	 * Contains every watcher registered.
	 */
	const watcherRegistry = useRef<Map<string, WatcherUpdater>>(new Map())
	/**
	 * One entry for every watcher id and a corresponding set of field names it watches for.
	 */
	const watcherPropNameRegistry = useRef<Map<string, Set<string>>>(new Map())
	/**
	 * One entry for every field name that is actively watched and a set of watcher ids that need to be notified when it changes.
	 */
	const propNameWatcherIdsRegistry = useRef<Map<string, Set<string>>>(new Map())
	/**
	 * A set of watcher ids that should be notified whenever any field changes.
	 */
	const allPropsWatcherIdsRegistry = useRef<Set<string>>(new Set())

	const pickProperties = useCallback((propNames?: Iterable<string>) => {
		if (!propNames) {
			return { ...valueObject.current }
		}

		return Array.from(propNames || []).reduce<any>((acc, name) => {
			acc[name] = valueObject.current[name]
			return acc
		}, {})
	}, [])

	const callWatcher = useCallback((watcherId: string, allProps = false) => {
		const watcherFunc = watcherRegistry.current.get(watcherId)
		if (!watcherFunc) return

		if (allProps) {
			watcherFunc({ ...valueObject.current })
			return
		}

		const propNames = watcherPropNameRegistry.current.get(watcherId)
		if (!propNames) return

		watcherFunc(pickProperties(propNames), Array.from(propNames))
	}, [])

	/**
	 * Register a function that will receive a message once one or more of the specified properties
	 * are changed. If no `propNames` are specified the watcher will be notified once any field changes.
	 *
	 * Any one call to setValues will only trigger a registered watcher once even though it may watch
	 * for more than one property.
	 */
	const registerWatcher = useCallback(
		(
			watcherId: string,
			updater: WatcherUpdater,
			propNames?: string | string[]
		) => {
			watcherRegistry.current.set(watcherId, updater)
			if (propNames === undefined) {
				allPropsWatcherIdsRegistry.current.add(watcherId)
				callWatcher(watcherId)
				return
			}

			const arrayPropNames = Array.isArray(propNames) ? propNames : [propNames]
			watcherPropNameRegistry.current.set(watcherId, new Set(arrayPropNames))

			for (const propName of arrayPropNames) {
				const watchersList =
					propNameWatcherIdsRegistry.current.get(propName) || new Set<string>()
				watchersList.add(watcherId)
				propNameWatcherIdsRegistry.current.set(propName, watchersList)
			}
		},
		[]
	)
	const unregisterPropWatcher = useCallback((watcherId: string) => {
		const watchedPropNames = watcherPropNameRegistry.current.get(watcherId)

		if (watchedPropNames) {
			watcherPropNameRegistry.current.delete(watcherId)
			for (const propName of watchedPropNames) {
				const propNameWatchers = propNameWatcherIdsRegistry.current.get(
					propName
				)
				if (propNameWatchers) {
					propNameWatchers.delete(watcherId)
					if (propNameWatchers.size === 0) {
						propNameWatcherIdsRegistry.current.delete(propName)
					}
				}
			}
		}
	}, [])
	const unregisterWatcher = useCallback((watcherId: string) => {
		watcherRegistry.current.delete(watcherId)
		allPropsWatcherIdsRegistry.current.delete(watcherId)
		unregisterPropWatcher(watcherId)
	}, [])

	/**
	 * Notifies any watchers when any of the props they listen for changes.
	 * If the same watcher is listening for multiple props it will only be notified once.
	 */
	const notifyWatchers = useCallback((changedPropNames: string[]) => {
		const watcherIdsToNotify = new Set<string>()

		for (const allPropsWatcherId of allPropsWatcherIdsRegistry.current) {
			watcherIdsToNotify.add(allPropsWatcherId)
		}

		for (const changedPropName of changedPropNames) {
			const propWatchers = propNameWatcherIdsRegistry.current.get(
				changedPropName
			)
			if (propWatchers) {
				for (const watcherId of propWatchers) {
					watcherIdsToNotify.add(watcherId)
				}
			}
		}

		for (const watcherIdToNotify of watcherIdsToNotify) {
			callWatcher(
				watcherIdToNotify,
				allPropsWatcherIdsRegistry.current.has(watcherIdToNotify)
			)
		}
	}, [])
	const setValues = useCallback(
		(newValues: WatcherObject<TPropertyType>, doNotNotify = false) => {
			Object.assign(valueObject.current, newValues)
			if (doNotNotify) return
			notifyWatchers(Object.keys(newValues))
		},
		[]
	)
	const unsetValues = useCallback((props?: string[], doNotNotify = false) => {
		props = props || Object.keys(valueObject.current)
		const unsettableProps = props.filter(
			(prop) => valueObject.current[prop] !== undefined
		)

		for (const prop of unsettableProps) {
			delete valueObject.current[prop]
		}

		if (doNotNotify) return
		notifyWatchers(unsettableProps)
	}, [])
	const resetValues = useCallback((props?: string[], doNotNotify = false) => {
		props = props || Object.keys(valueObject.current)
		for (const prop of props) {
			const initialValue = initialValues[prop]
			if (initialValue) {
				valueObject.current[prop] = initialValue
			} else {
				delete valueObject.current[prop]
			}
		}

		if (doNotNotify) return
		notifyWatchers(props)
	}, [])

	return {
		values: valueObject.current,
		pickProperties,

		registerWatcher,
		unregisterWatcher,

		setValues,
		unsetValues,
		resetValues
	}
}
