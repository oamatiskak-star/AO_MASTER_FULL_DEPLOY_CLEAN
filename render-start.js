import { spawn } from "child_process"

const child = spawn("node", ["AO_MASTER_FULL_DEPLOY_CLEAN/ao.js"], {
  stdio: "inherit",
  env: process.env
})

child.on("exit", code => {
  console.log("AO exited with code", code)
  process.exit(code)
})
