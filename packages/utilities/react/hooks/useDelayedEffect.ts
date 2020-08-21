import { useEffect, useRef, EffectCallback, DependencyList } from "react"

/**
 * Creates an effect that will be delayed until the next available cycle.
 * Allows rendering to be performed before the effect triggers.
 * @param effect
 * @param deps
 */
export const useDelayedEffect = (
	effect: EffectCallback,
	deps?: DependencyList | undefined
) => {
	const cleanupFunc = useRef<any>()
	return useEffect(() => {
		setTimeout(() => {
			cleanupFunc.current = effect()
		}, 0)
		return () => {
			if (cleanupFunc.current) {
				return cleanupFunc.current()
			}
		}
	}, deps)
}
