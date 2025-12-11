
import { loadJobs } from "./lib/jobLoader.js"
import { runJob } from "./lib/jobRunner.js"

console.log("AO Executor gestart")

const jobs = await loadJobs()

for (const job of jobs) {
  console.log("Start job:", job.name)
  await runJob(job)
  console.log("Klaar:", job.name)
}
