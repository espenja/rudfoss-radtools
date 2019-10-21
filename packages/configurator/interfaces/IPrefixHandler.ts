export interface IPrefixHandler {
	prefixes: string | string[]
	handle<TOutput = any>(values: string[], prefix: string): 
}