/**
 * Combines a url with or without existing query parameters with additional query
 * parameters encoded for a URI (if encode is not defined or true).
 * @param url The base url to combine with, will remain unchanged.
 * @param data The additional data to append.
 * @param encode Whether or not to encode keys and values using `encodeURIComponent`
 */
export const makeQueryString = (url: string, data: { [key: string]: string }, encode = true) => {
	return `${url}${url.indexOf("?") >= 0 ? "&" : "?"}${Object.entries(data)
		.map(([key, value]) => `${encode ? encodeURIComponent(key) : key}=${encode ? encodeURIComponent(value) : value}`)
		.join("&")}`
}
