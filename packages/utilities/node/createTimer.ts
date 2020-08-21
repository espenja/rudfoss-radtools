const toMillis = (hrtime: ReturnType<typeof process.hrtime>) => {
	const [seconds, nanoseconds] = hrtime
	const nanoInMilli = nanoseconds / 1000000
	return seconds * 1000 + (nanoInMilli | 0)
}

/**
 * Creates a new timer that measures duration from the time it is created. Returns a new function that returns the
 * duration from initialization until its called.
 *
 * E.g.:
```ts
const timer = createTimer()

await doSomethingHeavy()
const firstHeavyDuration = timer()
console.log(`First heavy op took ${firstHeavyDuration.step}`)

await doSomethingElseHeavy()
const secondHeavyDuration = timer()
console.log(`Second heavy op took ${secondHeavyDuration.step}`)

console.log(`Total duration ${secondHeavyDuration.total}`)
```
 */
export const createTimer = () => {
	const start = toMillis(process.hrtime())
	let last = start
	return () => {
		const next = toMillis(process.hrtime())
		const step = next - last
		const total = next - start
		last = next

		return {
			step,
			total,
			toString: () => `${step}/${total}`
		}
	}
}
