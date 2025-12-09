const fs = require("fs");
const path = require("path");

const base = "backend-cloud";

const structure = [
  `${base}/api`,
  `${base}/api/routes`,
  `${base}/api/controllers`,
  `${base}/api/models`,
  `${base}/services`,
  `${base}/engines`,
  `${base}/workers`,
  `${base}/storage`
];

for (const dir of structure) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("Created:", dir);
  } else {
    console.log("Exists:", dir);
  }
}

console.log("CLOUD BACKEND STRUCTURE GENERATED");
