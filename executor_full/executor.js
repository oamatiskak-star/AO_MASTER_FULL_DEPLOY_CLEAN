– Start een Express-server
– Luistert op /webhook
– Draait jouw jobs bij elke webhook
– Blijft draaien
– Logt alles zichtbaar in Render
– Werkt met jouw bestaande jobLoader en jobRunner

Hier is het volledige bestand, kant-en-klaar.

const express = require("express")
const bodyParser = require("body-parser")
const { loadJobs } = require("./lib/jobLoader")
const { runJob } = require("./lib/jobRunner")

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
console.log("Fout in job runner:", err)
res.status(500).send("error")
}
})

const PORT = process.env.PORT || 10000
app.listen(PORT, "0.0.0.0", () => {
console.log("Executor draait op poort", PORT)
})
