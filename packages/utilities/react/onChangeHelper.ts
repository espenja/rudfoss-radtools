import React from "react"

/**
 * Helper function for extracting the text value from a change event.
 * @param onChange The handler to call when the value changes.
 * @param filter An optional filter for the new value.
 */
export const onChangeHelper = (
	onChange: (newText: string) => any,
	filter?: (newText: string) => boolean
) => (evt: React.ChangeEvent<any>) => {
	const newText = evt.target.value
	if (filter && !filter(newText)) return
	onChange(newText)
}

/**
 * Helper function for binding a change handler that sends the new value as its second argument.
 * @param onChange The handler to call when the value changes.
 * @param filter An optional filter for the new value.
 */
export const onChangeValueHelper = <TOutputValue>(
	onChange: (newValue: TOutputValue) => any,
	filter?: (newValue: TOutputValue) => boolean
) => (evt: any, newValue: any) => {
	if (filter && !filter(newValue)) return
	onChange(newValue as TOutputValue)
}
