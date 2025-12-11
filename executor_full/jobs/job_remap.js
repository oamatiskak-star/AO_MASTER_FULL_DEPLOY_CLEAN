module.exports = {
name: "job_remap",

async run({ log }) {
log("REMAPPING gestart")

// Basic structuur
const fs = require("fs")
const path = require("path")

const root = "/opt/render/project/src"
const archive = path.join(root, "ARCHIVE")

if (!fs.existsSync(archive)) {
  fs.mkdirSync(archive)
  log("ARCHIVE map aangemaakt")
}

const messy = [
  "executor",
  "frontend_copy",
  "frontend_old",
  "zip_uploads",
  "tmp",
  "samples",
  "__MACOSX"
]

messy.forEach(item => {
  const full = path.join(root, item)
  if (fs.existsSync(full)) {
    const dest = path.join(archive, item)
    fs.renameSync(full, dest)
    log(`→ Verplaatst naar ARCHIVE: ${item}`)
  }
})

log("REMAPPING voltooid")
return true


}
}
