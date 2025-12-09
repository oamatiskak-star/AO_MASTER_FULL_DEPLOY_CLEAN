
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "logs", "executor.log");

function log(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}
`;
  fs.appendFileSync(logFile, line);
  console.log(line.trim());
}

log("Executor gestart");

function run(cmd, okMsg, failMsg) {
  exec(cmd, (err, stdout) => {
    if (stdout && stdout.toLowerCase().includes("backend")) log(okMsg);
    else log(failMsg);
  });
}

setInterval(() => {
  run("curl -s http://localhost:4000/api/ping", "Backend lokaal OK", "Backend lokaal GEEN response");
  run("curl -s https://ao-master-full-deploy-clean.onrender.com/api/ping", "Backend Render OK", "Backend Render GEEN response");
  
  exec("curl -s https://ao-master-full-deploy-clean.vercel.app", (err, stdout) => {
    if (stdout && stdout.length > 20) log("Frontend Vercel OK");
    else log("Frontend Vercel GEEN response");
  });
}, 15000);

log("Executor draait in monitoring-modus");
