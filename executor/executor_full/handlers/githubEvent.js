import { verifySignature } from "./githubVerify.js"
import { mapGithubToJob } from "./githubMap.js"
import { logTelegram } from "../lib/notify.js"

export function createGithubHandler(secret, runJob) {
return async function githubWebhook(req, res) {
const event = req.headers["x-github-event"]
const delivery = req.headers["x-github-delivery"]

const ok = verifySignature(req, secret)
if (!ok) {
  await logTelegram("GitHub webhook geweigerd. Secret mismatch.")
  return res.status(401).send("invalid signature")
}

await logTelegram(`GitHub event ontvangen → ${event}`)

const jobName = mapGithubToJob(event, req.body)

await logTelegram(`AO map → taak: ${jobName}`)

try {
  await runJob(jobName)
  await logTelegram(`Taak voltooid → ${jobName}`)
  res.status(200).send("ok")
} catch (err) {
  await logTelegram(`FOUT taak → ${jobName}\n${err.toString()}`)
  res.status(500).send("error")
}


}
}
