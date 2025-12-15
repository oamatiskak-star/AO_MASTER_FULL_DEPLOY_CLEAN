import * as dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ROOT = process.env.AO_MAIN_PATH || "."
const OUTPUT_DIR = path.join(ROOT, "BUILDER_OUTPUT")

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

console.log("AO MASTER BUILDER gestart")
console.log("Werkt in MAIN:", ROOT)

async function run() {
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "approved")
    .eq("assigned_to", "builder")
    .limit(1)

  if (!tasks || tasks.length === 0) return

  const task = tasks[0]

  await supabase.from("tasks")
    .update({ status: "running" })
    .eq("id", task.id)

  const outFile = path.join(
    OUTPUT_DIR,
    `build_${task.id}.json`
  )

  fs.writeFileSync(outFile, JSON.stringify({
    task_id: task.id,
    project_id: task.project_id,
    type: task.type,
    payload: task.payload,
    built_at: new Date().toISOString()
  }, null, 2))

  await supabase.from("results").insert({
    project_id: task.project_id,
    type: "builder_output",
    data: {
      file: outFile
    }
  })

  await supabase.from("tasks")
    .update({ status: "done" })
    .eq("id", task.id)

  console.log("Build afgerond voor task", task.id)
}

setInterval(run, 3000)
