
import fs from "fs"
import path from "path"

export async function loadJobs(){
  const jobsDir = path.resolve("jobs")
  const files = fs.readdirSync(jobsDir)
  const jobs = []

  for(const f of files){
    if(f.endsWith(".js")){
      const job = await import("../jobs/" + f)
      if(job.default) jobs.push({ name:f, run:job.default })
    }
  }

  return jobs
}
