module.exports = {
async runPipeline(event, log) {

if (event === "push") {
  log("Pipeline: PUSH gedetecteerd → REMAP + REPAIR")
  return ["job_remap", "job_repair"]
}

if (event === "workflow_job") {
  log("Pipeline: WORKFLOW JOB → REPAIR")
  return ["job_repair"]
}

return ["job_repair"]


}
}
