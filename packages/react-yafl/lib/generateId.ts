/**
 * Creates a new id generator that returns an incremented string for every call.
 * @param prefix
 */
export const idGenerator = (prefix: string) => ((counter: number) => () => `${prefix}-${++counter}`)(0)
