import * as dotenv from "dotenv"
import fs from "fs"
import path from "path"
import express from "express"
import cors from "cors"
import { fileURLToPath } from "url"

dotenv.config({ path: "./.env" })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(cors())

// ----------------------------
// AUTOMATISCHE ROUTE-LOADER
// ----------------------------
const routesDir = path.join(__dirname, "routes")

fs.readdirSync(routesDir).forEach((file) => {
  if (!file.endsWith(".js")) return

  const routeName = file.replace(".js", "")
  const routePath = `/api/${routeName}`

  import(path.join(routesDir, file))
    .then((module) => {
      app.use(routePath, module.default)
      console.log(`Loaded route: ${routePath}`)
    })
    .catch((err) => {
      console.error(`Error loading route ${file}:`, err)
    })
})

// Fallback voor onbekende routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", route: req.originalUrl })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, "0.0.0.0", () => {
  console.log("AO Backend draait op poort: " + PORT)
})
