const fs = require("fs");
const path = require("path");

const structure = {
  frontend: ["pages","components","layouts","styles","assets"],
  backend: ["api","routes","controllers","services","middleware","utils"],
  executor: ["tasks","queue","commands"],
  database: ["schema","rls","functions"],
  workflows: [".github","scripts"],
  design: ["ui-kit","colors","templates"]
};

// root output
const outRoot = "structured";
if (!fs.existsSync(outRoot)) fs.mkdirSync(outRoot);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

Object.keys(structure).forEach(section=>{
  const dest = path.join(outRoot, section);
  ensureDir(dest);
});

// simple file mapper
function walk(dir){
  fs.readdirSync(dir).forEach(file=>{
    const full = path.join(dir,file);
    const stat = fs.statSync(full);
    if(stat.isDirectory()){
      walk(full);
    } else {
      const lower = full.toLowerCase();
      let mapped = null;

      if(lower.includes("page") || lower.includes("component") || lower.includes("layout"))
        mapped = "frontend";
      else if(lower.includes("server") || lower.includes("route") || lower.includes("controller"))
        mapped = "backend";
      else if(lower.includes("executor"))
        mapped = "executor";
      else if(lower.endsWith(".sql"))
        mapped = "database";
      else if(lower.includes("workflow") || lower.includes("vercel") || lower.includes("render"))
        mapped = "workflows";
      else if(lower.includes("css") || lower.includes("theme"))
        mapped = "design";

      if(mapped){
        const dest = path.join(outRoot, mapped, path.basename(full));
        fs.copyFileSync(full, dest);
      }
    }
  });
}

walk(".");

console.log("Mapping complete.");
