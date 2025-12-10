import axios from "axios"
import { sendTelegram } from "./telegram.js"

// Hard-coded fallback interval (1 minuut)
const PING_INTERVAL = 60 * 1000

// Backend URL uit environment
const BACKEND_URL = process.env.BACKEND_URL

// Executor URL uit environment (optioneel)
const EXECUTOR_URL = process.env.EXECUTOR_URL || "not-set"

// Startup event
async function notifyStartup() {
  await sendTelegram(
    `AO Executor gestart.\nBackend: ${BACKEND_URL}\nExecutor: ${EXECUTOR_URL}`
  )
}

// Error handler met Telegram
async function notifyError(err) {
  await sendTelegram(`AO Executor fout:\n${err?.message || err}`)
}

// Self-ping functie
async function selfPing() {
  try {
    const url = `${BACKEND_URL}/api/ping`
    const res = await axios.get(url)

    console.log("Self-ping OK:", res.data)

  } catch (err) {
    console.log("Self-ping ERROR:", err.message)
    await notifyError(err)
  }
}

// Main executor loop
async function startExecutor() {
  console.log("AO Executor wordt gestart...")
  await notifyStartup()

  // Eerste ping meteen
  await selfPing()

  // Interval pings
  setInterval(async () => {
    await selfPing()
  }, PING_INTERVAL)
}

// Start het systeem
startExecutor().catch(async err => {
  console.log("Startup ERROR:", err.message)
  await notifyError(err)
})
