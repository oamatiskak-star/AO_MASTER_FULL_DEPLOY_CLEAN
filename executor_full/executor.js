import express from "express"
import bodyParser from "body-parser"
import { loadJobs } from "./lib/jobLoader.js"
import { runJob } from "./lib/jobRunner.js"

const app = express()
app.use(bodyParser.json())

console.log("AO Executor gestart")

app.get("/", (req, res) => {
res.send("AO Executor actief")
})

app.post("/webhook", async (req, res) => {
console.log("Webhook ontvangen", {
event: req.headers["x-github-event"],
delivery: req.headers["x-github-delivery"]
})

try {
const jobs = await loadJobs()

for (const job of jobs) {
  console.log("Start job:", job.name)
  await runJob(job)
  console.log("Klaar:", job.name)
}

res.status(200).send("ok")


} catch (err) {
console.log("Fout in job runner", err)
res.status(500).send("error")
}
})

const PORT = process.env.PORT || 10000
app.listen(PORT, "0.0.0.0", () => {
console.log("AO Executor luistert op poort", PORT)
})
