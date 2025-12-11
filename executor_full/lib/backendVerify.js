const fs = require("fs")
const path = require("path")

module.exports = {
  async fix(log) {
    log("BackendVerify gestart")

    // Render root is: /opt/render/project/src
    const root = "/opt/render/project/src"

    const backend = path.join(root, "backend")
    if (!fs.existsSync(backend)) {
      log("Backend ontbreekt → aanmaken")
      fs.mkdirSync(backend)
    }

    const api = path.join(backend, "api")
    if (!fs.existsSync(api)) {
      fs.mkdirSync(api)
      log("backend/api aangemaakt")
    }

    const serverFile = path.join(api, "server.js")
    if (!fs.existsSync(serverFile)) {
      fs.writeFileSync(
        serverFile,
        `console.log("Auto server is door de AO Executor aangemaakt")`
      )
      log("server.js automatisch toegevoegd")
    }

    log("BackendVerify voltooid")
    return true
  }
}
