module.exports = {
name: "job_repair",

async run({ log }) {
log("REPAIR gestart")

const backendCheck = require("../lib/backendVerify")
const frontendLink = require("../lib/frontendLink")
const supaLink = require("../lib/supabaseLink")

await backendCheck.fix(log)
await frontendLink.link(log)
await supaLink.sync(log)

log("REPAIR voltooid")
return true


}
}
