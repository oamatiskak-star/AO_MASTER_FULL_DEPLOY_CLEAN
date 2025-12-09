import fs from "fs"
import path from "path"

const base = "backend-cloud"

const structure = [
  `${base}/api`,
  `${base}/api/routes`,
  `${base}/api/controllers`,
  `${base}/api/models`,
  `${base}/services`,
  `${base}/engines`,
  `${base}/workers`,
  `${base}/storage`
]

for (const dir of structure) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

console.log("CLOUD BACKEND STRUCTURE GENERATED")
