/**
 * Type-guard filter that determines if the value is undefined or not
 * @param value
 */
export const notUndefined = <TValue>(value: TValue | undefined): value is TValue => value !== undefined

/**
 * Type-guard filter that determines if the value is null or not
 * @param value
 */
export const notNull = <TValue>(value: TValue | null): value is TValue => value !== null
