module.exports = {
async sync(log) {

const fs = require("fs")
const path = require("path")

const root = "/opt/render/project/src"
const envPath = path.join(root, ".supabase.env")

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseAnon = process.env.SUPABASE_ANON_KEY || ""

fs.writeFileSync(envPath, `SUPABASE_URL=${supabaseUrl}\nSUPABASE_ANON_KEY=${supabaseAnon}\n`)
log("Supabase koppeling voltooid")


}
}
