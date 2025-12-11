import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function loadJobs() {
  // Absoluut pad naar executor_full/jobs
  const jobsDir = path.join(__dirname, "..", "jobs")

  if (!fs.existsSync(jobsDir)) {
    console.log("Jobs map niet gevonden:", jobsDir)
    return []
  }

  const files = fs.readdirSync(jobsDir).filter(f => f.endsWith(".js"))
  const jobs = []

  for (const file of files) {
    const fullPath = path.join(jobsDir, file)
    const jobModule = await import(fullPath)

    const runFn = jobModule.default?.run || jobModule.run
    const name = jobModule.default?.name || jobModule.name || file.replace(".js", "")

    if (runFn) {
      jobs.push({ name, run: runFn })
    } else {
      console.log("Job heeft geen run-functie:", file)
    }
  }

  return jobs
}
