const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function cleanDir(p) {
  const full = path.join(ROOT, p);
  if (!fs.existsSync(full)) return;

  for (const item of fs.readdirSync(full)) {
    if (item === ".github" || item === "scripts") continue;
    fs.rmSync(path.join(full, item), { recursive: true, force: true });
  }
}

function ensureDir(p) {
  const full = path.join(ROOT, p);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
}

function move(src, dest) {
  const fullSrc = path.join(ROOT, src);
  const fullDest = path.join(ROOT, dest);

  if (!fs.existsSync(fullSrc)) return;

  ensureDir(path.dirname(fullDest));

  fs.renameSync(fullSrc, fullDest);
}

console.log("STRUCTURE BUILDER: Start");

cleanDir("./");

const MAPS = {
  frontend: [
    "frontend_full",
    "frontend_calculatie_module",
    "frontend_risico_analyse",
    "frontend_dashboard",
    "frontend_components",
    "frontend_global_styles",
    "frontend_icons_assets",
    "frontend_layouts",
    "frontend_error_handling",
    "frontend_settings",
    "frontend_projecten",
    "frontend_auth_flow"
  ],
  backend: [
    "backend_full"
  ],
  executor: [
    "executor_full"
  ],
  database: [
    "supabase",
    "ENV_AND_REPAIR_FULL"
  ],
  deploy: [
    "deploy_full"
  ],
  modules: [
    "STERKBOUW_ADMIN",
    "STERKBOUW_ARCHITECT",
    "STERKBOUW_BIM",
    "STERKBOUW_CALCULATOR",
    "STERKBOUW_DASHBOARD",
    "STERKBOUW_FILES",
    "STERKBOUW_FINANCE",
    "STERKBOUW_GLOBAL",
    "STERKBOUW_HELPDESK",
    "STERKBOUW_LOGISTIEK",
    "STERKBOUW_NOTIFICATIES",
    "STERKBOUW_PROJECTS",
    "STERKBOUW_RISK",
    "STERKBOUW_SAAS",
    "STERKBOUW_SAAS_MEGA",
    "STERKBOUW_TEAM",
    "STERKBOUW_WORKFLOWS"
  ]
};

for (const group in MAPS) {
  for (const folder of MAPS[group]) {
    move(folder, `app/${group}/${folder}`);
  }
}

const TRASH = fs.readdirSync(ROOT).filter(f => f.startsWith("AO_MISSING"));
for (const x of TRASH) {
  fs.rmSync(path.join(ROOT, x), { recursive: true, force: true });
}

console.log("STRUCTURE BUILDER voltooid.");
