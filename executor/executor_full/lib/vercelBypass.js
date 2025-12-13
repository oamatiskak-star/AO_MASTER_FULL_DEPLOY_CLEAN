const fetch = require("node-fetch")

const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID

async function triggerDeploy(log) {
if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
log("Geen Vercel credentials ingesteld")
return false
}

const url = https://api.vercel.com/v13/deployments

const body = {
name: "sterkbouw",
project: VERCEL_PROJECT_ID
}

const response = await fetch(url, {
method: "POST",
headers: {
Authorization: Bearer ${VERCEL_TOKEN},
"Content-Type": "application/json"
},
body: JSON.stringify(body)
})

if (response.status === 429) {
log("VERCEL RATE LIMIT → opnieuw proberen in 5 seconden")
await new Promise(r => setTimeout(r, 5000))
return triggerDeploy(log)
}

const json = await response.json()

log("Vercel deploy gestart:", json)

return true
}

module.exports = { triggerDeploy }
