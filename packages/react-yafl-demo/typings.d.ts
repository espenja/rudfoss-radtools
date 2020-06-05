/**
 * Similar to the module above this allows us to import any json file without issues.
 */
declare module "*.json" {
	const value: any
	export default value
}
