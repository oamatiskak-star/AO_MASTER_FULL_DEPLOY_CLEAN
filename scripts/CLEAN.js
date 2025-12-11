// CLEAN.js — directe opschoning ROOT

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const TO_REMOVE = [
  "AO_MISSING_COMPONENTS",
  "AO_MISSING_COMPONENTS_100",
  "AO_MISSING_COMPONENTS_100_B",
  "AO_MISSING_COMPONENTS_100_PACK_1",
  "AO_MISSING_COMPONENTS_100_PACK_2",
  "AO_MISSING_COMPONENTS_100_PACK_3",
  "AO_MISSING_COMPONENTS_100_PACK_4",
  "AO_MISSING_COMPONENTS_100_PACK_5",
  "AO_MISSING_COMPONENTS_100_PACK_6",
  "AO_MISSING_COMPONENTS_100_PACK_7",
  "AO_MISSING_COMPONENTS_100_PACK_8",
  "AO_MISSING_COMPONENTS_100_PACK_9",
  "AO_MISSING_COMPONENTS_100_PACK_10",
  "AO_MISSING_COMPONENTS_100_PACK_11",
  "AO_MISSING_COMPONENTS_100_PACK_12",
  "AO_MISSING_COMPONENTS_100_PACK_13",
  "AO_MISSING_COMPONENTS_100_PACK_14",

  "frontend 2",
  "frontend_full",
  "frontend_components",
  "frontend_dashboard",
  "frontend_error_handling",
  "frontend_calculatie_module",
  "frontend_global_styles",
  "frontend_icons_assets",
  "frontend_layouts",
  "frontend_projecten",
  "frontend_risico_analyse",
  "frontend_settings",

  "executor_full",
  "deploy_full",
  "database_full",

  "design",
  "structured",
  "ui-library",
  "repo_clean",
];

function remove(p) {
  const full = path.join(ROOT, p);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
    console.log("VERWIJDERD:", p);
  }
}

console.log("Start opschonen…");
TO_REMOVE.forEach(remove);
console.log("Opschonen klaar.");
