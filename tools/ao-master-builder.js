import fs from "fs"
import path from "path"

const MAIN_ROOT = process.env.AO_MAIN_REPO || "."
const ARCH_OUTPUT = "ARCHITECT_REPORT.json"

console.log("AO MASTER BUILDER gestart")
console.log("Werkmap:", MAIN_ROOT)

function requireFile(file) {
  if (!fs.existsSync(file)) {
    console.error("Vereist bestand ontbreekt:", file)
    process.exit(1)
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log("Map aangemaakt:", dir)
  }
}

function writeFileSafe(file, content) {
  if (fs.existsSync(file)) {
    console.log("Bestand bestaat al, overslaan:", file)
    return
  }
  fs.writeFileSync(file, content)
  console.log("Bestand geschreven:", file)
}

requireFile(ARCH_OUTPUT)

/*
EERSTE GECONTROLEERDE BUILD
– we maken alleen een builder-output map
– nog geen backend of frontend code
*/

const builderRoot = path.join("BUILDER_OUTPUT")
ensureDir(builderRoot)

writeFileSafe(
  path.join(builderRoot, "README.md"),
  "AO Master Builder output\n\nDeze map is automatisch aangemaakt."
)

console.log("AO MASTER BUILDER klaar")
process.exit(0)
