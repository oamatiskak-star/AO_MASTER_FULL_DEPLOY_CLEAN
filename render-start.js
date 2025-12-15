const child = spawn("node", ["src/ao.js"], {

Om naar:

const child = spawn("node", ["ao.js"], {

Volledige render-start.js:

import { spawn } from "child_process";

console.log("AO Render start wrapper actief");

const child = spawn("node", ["ao.js"], {
stdio: "inherit",
env: process.env,
});

child.on("exit", (code) => {
console.log("AO exited with code", code);
process.exit(code);
});
