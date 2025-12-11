const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log("[FINALIZE]", msg);
}

log("Start Finalisatie SAAS…");

const ROOT = process.cwd();

const SOURCES = [
  "frontend_full",
  "backend_full",
  "executor_full",
  "database_full",
  "deploy_full",
  "calculatie_full",
  "ENV_AND_REPAIR_FULL",
  "STERKBOUW_ADMIN",
  "STERKBOUW_ARCHITECT",
  "STERKBOUW_BIM",
  "STERKBOUW_CALCULATOR",
  "STERKBOUW_DASHBOARD",
  "STERKBOUW_FILES",
  "STERKBOUW_FINANCE",
  "STERKBOUW_GLOBAL",
  "STERKBOUW_HELPDESK",
  "STERKBOUW_LAYOUT",
  "STERKBOUW_LOGISTIEK",
  "STERKBOUW_NOTIFICATIES",
  "STERKBOUW_PROJECTS",
  "STERKBOUW_RISK",
  "STERKBOUW_SAAS",
  "STERKBOUW_SAAS_MEGA",
  "STERKBOUW_TEAM",
  "STERKBOUW_WORKFLOWS"
];

const TARGETS = {
  frontend: "app/frontend",
  backend: "app/backend",
  executor: "app/executor",
  database: "app/database",
  deploy: "app/deploy",
  env: "app/env",
  modules: "app/modules"
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copy(src, dest) {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const file of fs.readdirSync(src)) {
      copy(path.join(src, file), path.join(dest, file));
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

Object.values(TARGETS).forEach(ensureDir);

log("Start kopiëren…");

for (const srcFolder of SOURCES) {
  const fullSrc = path.join(ROOT, srcFolder);
  if (!fs.existsSync(fullSrc)) {
    log(`ONTBREKEND → ${srcFolder}`);
    continue;
  }

  let target = TARGETS.modules;

  if (srcFolder.includes("frontend")) target = TARGETS.frontend;
  else if (srcFolder.includes("backend")) target = TARGETS.backend;
  else if (srcFolder.includes("executor")) target = TARGETS.executor;
  else if (srcFolder.includes("database")) target = TARGETS.database;
  else if (srcFolder.includes("deploy")) target = TARGETS.deploy;
  else if (srcFolder.includes("ENV")) target = TARGETS.env;

  const dest = path.join(target, srcFolder);

  log(`COPY: ${srcFolder} → ${dest}`);
  copy(fullSrc, dest);
}

log("Verwijderen oude pakketten…");

for (const item of fs.readdirSync(ROOT)) {
  if (item.startsWith("AO_MISSING_COMPONENTS")) {
    fs.rmSync(path.join(ROOT, item), { recursive: true, force: true });
    log(`VERWIJDERD: ${item}`);
  }
}

log("FINALISATIE COMPLETE ✔");
