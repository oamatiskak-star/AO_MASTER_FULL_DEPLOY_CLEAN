const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log("[CLEAN]", msg);
}

const ROOT = process.cwd();
const entries = fs.readdirSync(ROOT);

// Verwijder AO_MISSING* en PACK mappen
entries.forEach(item => {
  if (item.startsWith("AO_MISSING_COMPONENTS")) {
    const p = path.join(ROOT, item);
    fs.rmSync(p, { recursive: true, force: true });
    log("Verwijderd: " + item);
  }
});

// Verwijder lege mappen
function isEmpty(dir) {
  return fs.existsSync(dir) && fs.readdirSync(dir).length === 0;
}

entries.forEach(item => {
  const full = path.join(ROOT, item);
  if (fs.lstatSync(full).isDirectory()) {
    if (isEmpty(full)) {
      fs.rmSync(full, { recursive: true, force: true });
      log("Lege map verwijderd: " + item);
    }
  }
});

log("OPRUIMEN VOLTOOID");
