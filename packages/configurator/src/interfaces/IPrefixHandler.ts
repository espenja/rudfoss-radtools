export interface IPrefixHandler {
	prefixes: string | string[]
	handle(values: string[], prefix: string): any
}
