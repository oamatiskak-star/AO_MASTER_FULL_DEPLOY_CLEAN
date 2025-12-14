import express from "express"

const router = express.Router()

/*
BASIS HEALTH
– voorkomt missing import errors
*/
router.get("/ping", (req, res) => {
  res.json({
    ok: true,
    service: "STERKBOUW SAAS BACKEND",
    timestamp: Date.now()
  })
})

/*
DYNAMISCHE ROUTE LOADER
– laadt alleen bestaande route files
*/
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const files = fs
  .readdirSync(__dirname)
  .filter(
    f =>
      f !== "index.js" &&
      f.endsWith(".js")
  )

for (const file of files) {
  try {
    const route = await import(`./${file}`)
    const routeName = "/" + file.replace(".js", "")
    router.use(routeName, route.default)
    console.log("[ROUTE LOADED]", routeName)
  } catch (e) {
    console.error("[ROUTE SKIPPED]", file)
  }
}

export default router
