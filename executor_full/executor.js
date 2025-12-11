const express = require("express")
const bodyParser = require("body-parser")
const crypto = require("crypto")

const { loadJobs } = require("./lib/jobLoader")
const { runJob } = require("./lib/jobRunner")

const app = express()
app.use(bodyParser.json())

console.log("AO Executor FULL gestart")

// =====================================================================
// HELPER: Verify GitHub Signature (veiligheid)
// =====================================================================
function verifySignature(req) {
const secret = process.env.WEBHOOK_SECRET
if (!secret) return true

const signature = req.headers["x-hub-signature-256"]
if (!signature) return false

const body = JSON.stringify(req.body)
const expected = "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex")

return signature === expected
}

// =====================================================================
// HELPER: Map event → specifieke job (extreem simpel en stabiel)
// =====================================================================
function mapGithubToJob(event, payload) {
if (event === "push" && payload?.ref === "refs/heads/main") {
return "job_build_main"
}

if (event === "workflow_job") {
return "job_workflow_completed"
}

if (event === "pull_request") {
if (payload?.action === "opened") return "job_pr_opened"
if (payload?.action === "closed") return "job_pr_closed"
}

// fallback job voor alle overige events
return "job_generic"
}

// =====================================================================
// HEALTH
// =====================================================================
app.get("/health", (req, res) => {
res.json({ ok: true, msg: "Executor FULL leeft" })
})

// =====================================================================
// STATUS
// =====================================================================
app.get("/status", async (req, res) => {
res.json({ ok: true, msg: "Executor FULL actief" })
})

// =====================================================================
// EXECUTE (AO stuurt taak)
// =====================================================================
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

// =====================================================================
// GITHUB WEBHOOK
// =====================================================================
app.post("/webhook", async (req, res) => {
const event = req.headers["x-github-event"]
const delivery = req.headers["x-github-delivery"]

console.log("GitHub webhook ontvangen", { event, delivery })

if (!verifySignature(req)) {
console.log("GitHub signature mismatch → geweigerd")
return res.status(401).send("invalid signature")
}

const payload = req.body
const mappedJob = mapGithubToJob(event, payload)

console.log("AO mapping → job:", mappedJob)

try {
// job loader werkt al met dynamische bestanden
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

// =====================================================================
// START SERVER
// =====================================================================
const PORT = process.env.PORT || 10000
app.listen(PORT, "0.0.0.0", () => {
console.log("Executor FULL draait op poort", PORT)
})
