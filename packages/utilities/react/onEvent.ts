interface EventOptions {
	preventDefault?: boolean
	stopPropagation?: boolean
}

type EventHandler = <T extends Event>(evt: T) => any

/**
 * Creates an event handler that configures the event accourding to the options before passing control to your handler.
 *
 * E.g.:
```typescript-react
<form onSubmit={onEvent({preventDefault: true})(handleSubmit)}>
// ...
```
 * @param options
 */
export const onEvent = <T extends Event>(options: EventOptions = {}) => {
	const { preventDefault = false, stopPropagation = false } = options
	return (handler: EventHandler) => (evt: T) => {
		if (preventDefault) {
			evt.preventDefault()
		}
		if (stopPropagation) {
			evt.stopPropagation()
		}
		handler(evt)
	}
}

/**
 * Prevents default action for an event before passing it to your handler.
 */
export const onEventPreventDefault = onEvent({ preventDefault: true })
