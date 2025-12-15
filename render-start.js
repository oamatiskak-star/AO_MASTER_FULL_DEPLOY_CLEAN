import { spawn } from "child_process";

console.log("AO Render start wrapper actief");

const child = spawn("node", ["src/ao.js"], {
stdio: "inherit",
env: process.env,
});

child.on("exit", (code) => {
console.log("AO exited with code", code);
process.exit(code);
});
