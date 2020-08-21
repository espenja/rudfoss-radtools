import fs from "fs"
import { promisify } from "util"

export const movePath = promisify(fs.rename)
