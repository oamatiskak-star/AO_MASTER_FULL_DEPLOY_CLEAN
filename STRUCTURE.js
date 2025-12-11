const fs = require("fs-extra");
const path = require("path");

function log(x){ console.log("[STRUCTURE]", x); }

const ROOT = process.cwd();

const TARGET = {
  frontend: "app/frontend",
  backend: "app/backend",
  executor: "app/executor",
  database: "app/database",
  modules: "app/modules"
};

Object.values(TARGET).forEach(d => fs.ensureDirSync(d));

const MAPS = {
  frontend: ["frontend", "frontend_full", "frontend2", "frontend 2"],
  backend: ["backend", "backend_full"],
  executor: ["executor", "executor_full"],
  database: ["database", "database_full"],
  modules: [
    "STERKBOUW_ADMIN","STERKBOUW_ARCHITECT","STERKBOUW_BIM",
    "STERKBOUW_CALCULATOR","STERKBOUW_DASHBOARD","STERKBOUW_FILES",
    "STERKBOUW_FINANCE","STERKBOUW_GLOBAL","STERKBOUW_HELPDESK",
    "STERKBOUW_LOGISTIEK","STERKBOUW_PROJECTS","STERKBOUW_RISK",
    "STERKBOUW_SAAS","STERKBOUW_SAAS_MEGA","STERKBOUW_TEAM",
    "STERKBOUW_NOTIFICATIES","STERKBOUW_WORKFLOWS"
  ]
};

function move(names, dest){
  names.forEach(name=>{
    const full = path.join(ROOT, name);
    if(fs.existsSync(full)){
      log("→ " + name + " → " + dest);
      fs.copySync(full, path.join(dest, name));
    }
  });
}

log("START STRUCTURING");

// voer georganiseerde moves uit
move(MAPS.frontend, TARGET.frontend);
move(MAPS.backend, TARGET.backend);
move(MAPS.executor, TARGET.executor);
move(MAPS.database, TARGET.database);
move(MAPS.modules, TARGET.modules);

log("STRUCTURING COMPLETE");
