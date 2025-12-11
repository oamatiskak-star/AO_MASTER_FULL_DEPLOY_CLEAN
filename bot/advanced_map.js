const fs = require("fs");
const path = require("path");

const OUT = "structured_advanced";
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// categorieën voor herkenning
const rules = [
  { name: "frontend", match: [/pages?/, /components?/, /layouts?/, /hooks?/, /styles?/] },
  { name: "backend", match: [/routes?/, /controllers?/, /services?/, /middleware/, /server/, /api/] },
  { name: "executor", match: [/executor/, /jobs?/, /tasks?/ ] },
  { name: "database", match: [/\.sql$/, /migrations/, /schema/, /rls/, /supabase/] },
  { name: "workflows", match: [/vercel/, /render/, /\.yml$/, /\.yaml$/, /github/] },
  { name: "design", match: [/css$/, /scss$/, /theme/, /design/, /ui/, /icons?/] }
];

// mappen aanmaken
function ensureFolder(base, name) {
  const dir = path.join(base, name);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

rules.forEach(rule => ensureFolder(OUT, rule.name));

function findCategory(filePath) {
  const lower = filePath.toLowerCase();
  for (const rule of rules) {
    if (rule.match.some(re => re.test(lower))) return rule.name;
  }
  return null;
}

// recursive scanner
function walk(dir) {
  fs.readdirSync(dir).forEach(item => {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      // skip output folders
      if (full.includes(OUT)) return;
      walk(full);
    } else {
      const category = findCategory(full);
      if (category) {
        const dest = path.join(OUT, category, path.basename(full));

        // file conflict fallback
        let finalDest = dest;
        let counter = 1;

        while (fs.existsSync(finalDest)) {
          const ext = path.extname(dest);
          const base = dest.replace(ext, "");
          finalDest = base + "_" + counter + ext;
          counter++;
        }

        fs.copyFileSync(full, finalDest);
        console.log("Mapped:", full, "→", finalDest);
      }
    }
  });
}

console.log("Advanced mapper gestart...");
walk(".");
console.log("Advanced mapping afgerond. Output in:", OUT);
