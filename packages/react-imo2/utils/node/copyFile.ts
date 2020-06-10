import fs from "fs-extra"

export const copyFile = async (source: string, dest: string) => {
	await fs.copy(source, dest)
}
