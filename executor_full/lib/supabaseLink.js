const fs = require("fs")
const path = require("path")

module.exports = {
  async sync(log) {
    log("SupabaseLink gestart")

    const root = "/opt/render/project/src"
    const envPath = path.join(root, ".supabase.env")

    const supabaseUrl = process.env.SUPABASE_URL || ""
    const supabaseAnon = process.env.SUPABASE_ANON_KEY || ""

    const content =
      `SUPABASE_URL=${supabaseUrl}\n` +
      `SUPABASE_ANON_KEY=${supabaseAnon}\n`

    fs.writeFileSync(envPath, content)

    log(".supabase.env geüpdatet")
    log("SupabaseLink voltooid")

    return true
  }
}
