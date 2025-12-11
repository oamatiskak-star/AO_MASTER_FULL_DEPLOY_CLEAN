const fs = require("fs");
const path = require("path");

function log(msg) { console.log("[REPAIR]", msg); }

const ROOT = process.cwd();

const TARGET = {
  frontend: "app/frontend",
  backend: "app/backend",
  executor: "app/executor",
  database: "app/database",
  deploy: "app/deploy",
  env: "app/env",
  modules: "app/modules"
};

// maak doelmappen
Object.values(TARGET).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function removeDirRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

// verwijder AO_MISSING rommel
fs.readdirSync(ROOT).forEach(item => {
  if (item.startsWith("AO_MISSING_") || item.includes("_PACK_")) {
    removeDirRecursive(path.join(ROOT, item));
    log("Verwijderd: " + item);
  }
});

// verwijder lege mappen
function deleteEmptyFolders(folder) {
  if (!fs.existsSync(folder)) return;
  let files = fs.readdirSync(folder);
  if (files.length === 0) {
    fs.rmdirSync(folder);
    log("Lege map verwijderd: " + folder);
    return;
  }
  for (const file of files) {
    const full = path.join(folder, file);
    if (fs.lstatSync(full).isDirectory()) {
      deleteEmptyFolders(full);
      if (fs.existsSync(full) && fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
        log("Lege map verwijderd: " + full);
      }
    }
  }
}

deleteEmptyFolders(ROOT);

// kopieerfunctie
function copy(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copy(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// auto-detecteer mappen → structureer
fs.readdirSync(ROOT).forEach(item => {
  const full = path.join(ROOT, item);
  if (!fs.existsSync(full) || !fs.lstatSync(full).isDirectory()) return;

  let target = null;

  if (item.includes("frontend")) target = TARGET.frontend;
  else if (item.includes("backend")) target = TARGET.backend;
  else if (item.includes("executor")) target = TARGET.executor;
  else if (item.includes("database")) target = TARGET.database;
  else if (item.includes("deploy")) target = TARGET.deploy;
  else if (item.toUpperCase().startsWith("ENV")) target = TARGET.env;
  else target = TARGET.modules;

  log(`Kopieer ${item} → ${target}`);
  copy(full, path.join(target, item));
});

// laatste schoonmaak
deleteEmptyFolders(ROOT);

log("STRUCTURE + CLEAN COMPLEET ✔");
