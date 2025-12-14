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
– Vereist per module: /<module>/index.js
– Slaat index.js zelf over
– Crasht NOOIT bij fouten
*/

async function loadRoutes() {
  const entries = fs.readdirSync(__dirname, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const moduleName = entry.name
    const moduleIndex = path.join(__dirname, moduleName, "index.js")

    if (!fs.existsSync(moduleIndex)) {
      console.log("[ROUTES] SKIP (geen index.js):", moduleName)
      continue
    }

    try {
      const mod = await import(`./${moduleName}/index.js`)
      if (!mod.default) {
        console.log("[ROUTES] SKIP (geen default export):", moduleName)
        continue
      }

      router.use(`/${moduleName}`, mod.default)
      console.log("[ROUTES] GELADEN:", moduleName)
    } catch (err) {
      console.error("[ROUTES] FOUT BIJ LADEN:", moduleName, err.message)
    }
  }
}

/*
INIT
– Laadt routes asynchroon
– Server kan starten zonder blokkade
*/
loadRoutes()

/*
FALLBACK
– Nooit Express default 404
*/
router.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "API route bestaat niet"
  })
})

export default router
