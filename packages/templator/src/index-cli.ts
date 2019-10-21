const start = async () => {
	console.log("TemplatOr cli, hello world")
}

start().catch((err: any) => {
	console.error(err)
	process.exit(1)
})
