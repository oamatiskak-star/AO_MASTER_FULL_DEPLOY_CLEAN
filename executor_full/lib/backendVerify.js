module.exports = {
async fix(log) {

const fs = require("fs")
const path = require("path")

const backend = path.join("/opt/render/project/src", "backend")

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
  fs.writeFileSync(serverFile, `console.log("Auto server aangemaakt")`)
  log("server.js automatisch toegevoegd")
}

log("Backend controle klaar")


}
}
