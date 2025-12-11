const fs = require("fs")
const path = require("path")

module.exports = {
  async link(log) {
    log("FrontendLink gestart")

    const root = "/opt/render/project/src"
    const frontend = path.join(root, "frontend")

    if (!fs.existsSync(frontend)) {
      log("Frontend ontbreekt → overslaan")
      return true
    }

    const envFile = path.join(frontend, ".env.local")

    const backendUrl =
      process.env.BACKEND_URL ||
      "https://ao-backend.onrender.com"

    const content = `NEXT_PUBLIC_BACKEND_URL=${backendUrl}\n`

    fs.writeFileSync(envFile, content)
    log(".env.local geüpdatet voor frontend")

    log("FrontendLink voltooid")
    return true
  }
}
