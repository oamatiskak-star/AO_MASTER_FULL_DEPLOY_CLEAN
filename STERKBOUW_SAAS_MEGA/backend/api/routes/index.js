import fs from "fs"
import path from "path"
import express from "express"
import { fileURLToPath } from "url"

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/*
  Dit script:
  – Laadt ALLE submappen in /routes automatisch
  – Laadt elk index.js bestand per module
  – Maakt routes beschikbaar als: /api/<mapnaam>
  – Geen hardcoded imports
  – SaaS-proof
*/

const entries = fs.readdirSync(__dirname, { withFileTypes: true })

for (const entry of entries) {
  if (!entry.isDirectory()) continue

  const moduleName = entry.name
  const moduleIndex = path.join(__dirname, moduleName, "index.js")

  if (!fs.existsSync(moduleIndex)) {
    console.warn(`[ROUTES] overgeslagen (geen index.js): ${moduleName}`)
    continue
  }

  try {
    const module = await import(`./${moduleName}/index.js`)
    if (!module.default) {
      console.warn(`[ROUTES] geen default export in ${moduleName}`)
      continue
    }

    router.use(`/${moduleName}`, module.default)
    console.log(`[ROUTES] geladen: /api/${moduleName}`)
  } catch (err) {
    console.error(`[ROUTES] fout bij laden ${moduleName}`, err.message)
  }
}

export default router
