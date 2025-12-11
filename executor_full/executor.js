const express = require("express")
const bodyParser = require("body-parser")
const { loadJobs } = require("./lib/jobLoader")
const { runJob } = require("./lib/jobRunner")

const app = express()
app.use(bodyParser.json())

console.log("AO Executor FULL gestart")

// -------------------------------------------------
// HEALTH
// -------------------------------------------------
app.get("/health", (req, res) => {
res.json({ ok: true, msg: "Executor FULL leeft" })
})

// -------------------------------------------------
// STATUS
// -------------------------------------------------
app.get("/status", async (req, res) => {
res.json({ ok: true, msg: "Executor FULL actief" })
})

// -------------------------------------------------
// EXECUTE (AO stuurt taak)
// -------------------------------------------------
app.post("/execute", async (req, res) => {
try {
const task = req.body.task
console.log("FULL executor taak ontvangen:", task)

const jobs = await loadJobs()

for (const job of jobs) {
  console.log("Start job:", job.name)
  await runJob(job)
  console.log("Klaar:", job.name)
}

res.json({ ok: true })


} catch (err) {
console.log("FULL executor fout:", err.toString())
res.status(500).json({ ok: false, error: err.toString() })
}
})

// -------------------------------------------------
// GITHUB WEBHOOK
// -------------------------------------------------
app.post("/webhook", async (req, res) => {
console.log("GitHub webhook ontvangen", {
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
console.log("Webhook fout:", err.toString())
res.status(500).send("error")
}
})

// -------------------------------------------------
// START SERVER
// -------------------------------------------------
const PORT = process.env.PORT || 10000
app.listen(PORT, "0.0.0.0", () => {
console.log("Executor FULL draait op poort", PORT)
})
