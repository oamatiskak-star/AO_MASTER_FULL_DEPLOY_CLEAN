import { createClient } from "@supabase/supabase-js"
import fs from "fs"

const sql = fs.readFileSync("./ao_migrations/schema.sql", "utf8")

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_ROLE
)

async function run() {
const { error } = await supabase.rpc("execute_sql", { sql })
if (error) console.log("Fout:", error)
else console.log("Migratie voltooid")
}

run()
