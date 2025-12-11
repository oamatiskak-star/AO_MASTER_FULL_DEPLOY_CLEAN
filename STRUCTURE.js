const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log("[STRUCTURE]", msg);
}

const ROOT = process.cwd();

// Doelmappen
const TARGET = {
  frontend: "app/frontend",
  backend: "app/backend",
  executor: "app/executor",
  database: "app/database",
  deploy: "app/deploy",
  modules: "app/modules",
  env: "app/env"
};

// Zorg dat doelstructuur bestaat
Object.values(TARGET).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Kopieerfunctie
function copy(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copy(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// Detecteer alle mappen in root
const all = fs.readdirSync(ROOT);

all.forEach(item => {
  const full = path.join(ROOT, item);
  if (!fs.lstatSync(full).isDirectory()) return;

  let target = null;

  if (item.includes("frontend")) target = TARGET.frontend;
  else if (item.includes("backend")) target = TARGET.backend;
  else if (item.includes("executor")) target = TARGET.executor;
  else if (item.includes("database")) target = TARGET.database;
  else if (item.includes("deploy")) target = TARGET.deploy;
  else if (item.startsWith("ENV")) target = TARGET.env;
  else target = TARGET.modules;

  log(`Kopieer → ${item} → ${target}`);
  copy(full, path.join(target, item));
});

log("STRUCTURE COMPLEET.");
