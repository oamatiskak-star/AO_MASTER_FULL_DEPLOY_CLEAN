import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/*
AUTOMATISCHE MODULE LOADER
– Laadt ALLE submappen in api/routes
– Slaat index.js zelf over
– Crasht niet bij fouten
*/

const entries = fs.readdirSync(__dirname, { withFileTypes: true })

for (const entry of entries) {
  if (!entry.isDirectory()) continue

  const moduleName = entry.name
  const moduleIndex = path.join(__dirname, moduleName, "index.js")

  if (!fs.existsSync(moduleIndex)) {
    console.log("SKIP route zonder index.js:", moduleName)
    continue
  }

  try {
    const module = await import(`./${moduleName}/index.js`)
    router.use(`/${moduleName}`, module.default)
    console.log("ROUTE GELADEN:", moduleName)
  } catch (err) {
    console.error("ROUTE FOUT:", moduleName, err.message)
  }
}

/*
FALLBACK
*/
router.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "API route bestaat niet"
  })
})

export default router
