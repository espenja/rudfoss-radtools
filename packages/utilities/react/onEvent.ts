interface IOnEventOptions {
	preventDefault?: boolean
	stopPropagation?: boolean
}

type EventHandler = <T extends React.BaseSyntheticEvent>(evt: T) => any

/**
 * Creates an event handler that configures the event accordingly before passing control to your handler.
 * @param options
 */
export const onEvent = <T extends React.BaseSyntheticEvent>(
	options: IOnEventOptions = {}
) => {
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
