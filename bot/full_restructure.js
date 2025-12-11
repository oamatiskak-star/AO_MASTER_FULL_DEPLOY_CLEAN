const fs = require("fs");
const path = require("path");

const INPUT = "structured_advanced";
const OUTPUT = "repo_clean";

if (fs.existsSync(OUTPUT)) {
  fs.rmSync(OUTPUT, { recursive: true });
}
fs.mkdirSync(OUTPUT);

// hoofdstructuur
const sections = ["frontend", "backend", "executor", "database", "workflows", "design"];

sections.forEach(sec => {
  const folder = path.join(OUTPUT, sec);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
});

function moveSection(section) {
  const src = path.join(INPUT, section);
  const dest = path.join(OUTPUT, section);

  if (!fs.existsSync(src)) return;

  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.existsSync(destFile)) {
      const ext = path.extname(file);
      const base = file.replace(ext, "");
      let final = destFile;
      let i = 1;

      while (fs.existsSync(final)) {
        final = path.join(dest, `${base}_${i}${ext}`);
        i++;
      }

      fs.renameSync(srcFile, final);
    } else {
      fs.renameSync(srcFile, destFile);
    }
  });
}

sections.forEach(moveSection);

console.log("Nieuwe repo structuur aangemaakt onder:", OUTPUT);
console.log("Je kunt deze map als nieuwe MAIN gebruiken.");
