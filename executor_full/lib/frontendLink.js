module.exports = {
async link(log) {

const fs = require("fs")
const path = require("path")

const frontend = path.join("/opt/render/project/src", "frontend")

if (!fs.existsSync(frontend)) {
  log("Frontend ontbreekt")
  return
}

const envFile = path.join(frontend, ".env.local")

const backendUrl = process.env.BACKEND_URL || "https://ao-backend.onrender.com"

fs.writeFileSync(envFile, `NEXT_PUBLIC_BACKEND_URL=${backendUrl}\n`)
log("Frontend .env.local geüpdatet")


}
}
