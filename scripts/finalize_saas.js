const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log("[FINALIZE]", msg);
}

log("Start Finalisatie SAAS…");

const ROOT = process.cwd();

// Alle bronmappen die al in GitHub staan
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

// Doelstructuur
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
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    log(`FOUT bij aanmaken map ${dir}: ${err.message}`);
  }
}

function copy(src, dest) {
  try {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
      ensureDir(dest);
      const files = fs.readdirSync(src);
      for (const file of files) {
        copy(path.join(src, file), path.join(dest, file));
      }
    } else {
      ensureDir(path.dirname(dest));
      fs.copyFileSync(src, dest);
    }
  } catch (err) {
    log(`Copy error ${src} → ${dest}: ${err.message}`);
  }
}

log("Controle doelstructuur…");
Object.values(TARGETS).forEach(ensureDir);

log("Kopiëren van alle componenten…");

for (const srcFolder of SOURCES) {
  const fullSrc = path.join(ROOT, srcFolder);

  if (!fs.existsSync(fullSrc)) {
    log(`Ontbreekt: ${srcFolder} (overslaan)`);
    continue;
  }

  let targetCategory = TARGETS.modules;

  if (srcFolder.includes("frontend")) targetCategory = TARGETS.frontend;
  else if (srcFolder.includes("backend")) targetCategory = TARGETS.backend;
  else if (srcFolder.includes("executor")) targetCategory = TARGETS.executor;
  else if (srcFolder.includes("database")) targetCategory = TARGETS.database;
  else if (srcFolder.includes("deploy")) targetCategory = TARGETS.deploy;
  else if (srcFolder.includes("ENV")) targetCategory = TARGETS.env;

  log(`Kopieer: ${srcFolder} → ${targetCategory}/${srcFolder}`);
  copy(fullSrc, path.join(targetCategory, srcFolder));
}

log("Opruimen oude AO_MISSING bestanden…");

try {
  const items = fs.readdirSync(ROOT);
  for (const file of items) {
    if (file.startsWith("AO_MISSING_COMPONENTS")) {
      fs.rmSync(path.join(ROOT, file), { recursive: true, force: true });
      log(`Verwijderd: ${file}`);
    }
  }
} catch (err) {
  log("Fout bij opruimen oude bestanden: " + err.message);
}

log("Finalisatie voltooid. Alle SAAS-componenten staan op juiste plek.");

process.exit(0);

