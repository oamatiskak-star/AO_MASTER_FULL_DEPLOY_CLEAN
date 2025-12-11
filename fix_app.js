const fs = require("fs");
const path = require("path");

function log(t) { console.log("[FIX]", t); }

const ROOT = process.cwd();

// Zorg dat directory bestaat
function ensure(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Kopieer directory
function copy(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensure(dest);
    for (const file of fs.readdirSync(src)) {
      copy(path.join(src, file), path.join(dest, file));
    }
  } else {
    ensure(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

log("Start SUPER FIX");

// 1. Maak geldige Vercel structuur aan
ensure("app");
ensure("app/frontend");
ensure("app/backend");
ensure("app/executor");
ensure("app/database");

// 2. FRONTEND FIX
const possibleFrontends = [
  "frontend",
  "frontend_full",
  "frontend 2",
  "frontend2",
  "frontend_clean"
];

let foundFrontend = null;
for (const f of possibleFrontends) {
  if (fs.existsSync(f)) {
    foundFrontend = f;
    break;
  }
}

if (!foundFrontend) {
  log("GEEN frontend gevonden. STOP.");
  process.exit(1);
}

log("Frontend gevonden: " + foundFrontend);
copy(foundFrontend, "app/frontend");

// 3. BACKEND FIX
const backends = ["backend", "backend_full"];
for (const b of backends) {
  if (fs.existsSync(b)) {
    log("Backend: " + b);
    copy(b, "app/backend");
  }
}

// 4. EXECUTOR FIX
const executors = ["executor", "executor_full"];
for (const e of executors) {
  if (fs.existsSync(e)) {
    log("Executor: " + e);
    copy(e, "app/executor");
  }
}

// 5. DATABASE FIX
const dbs = ["database", "database_full"];
for (const d of dbs) {
  if (fs.existsSync(d)) {
    log("Database: " + d);
    copy(d, "app/database");
  }
}

// 6. Verwijder troep
const shit = [
  "frontend 2",
  "frontend2",
  "frontend_full",
  "backend_full",
  "executor_full",
  "database_full",
  "calculatie_full",
  "deploy_full",
  "logs"
];

for (const f of shit) {
  if (fs.existsSync(f)) {
    fs.rmSync(f, { recursive: true, force: true });
    log("DELETED: " + f);
  }
}

log("STRUCTUUR FIX VOLTOOID");

// 7. Maak Vercel build root
fs.writeFileSync(
  "vercel.json",
  JSON.stringify(
    {
      buildCommand: "npm run build",
      outputDirectory: "app/frontend/.next",
      installCommand: "npm install",
      cleanUrls: true
    },
    null,
    2
  )
);

log("VERCEL CONFIG TOEGEVOEGD");

// 8. Klaar
log("SUPER FIX VOLTOOID — commit & wacht op deploy.");
process.exit(0);
