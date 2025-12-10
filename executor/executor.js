import axios from "axios"
import { sendTelegram } from "./telegram.js"
import { handleTelegramCommand } from "./telegramCommands.js"

console.log("AO Executor gestart…")

// Basisconfig vanuit Render environment
const BACKEND_URL = process.env.BACKEND_URL
const FRONTEND_URL = process.env.FRONTEND_URL
const EXECUTOR_URL = process.env.EXECUTOR_URL

// Interval voor self-ping
const SELF_PING_INTERVAL = 30000

// Self-ping functie
async function selfPing() {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/ping`)
    console.log("Self-ping OK", res.status)
  } catch (err) {
    console.error("Self-ping fout", err.message)
    await sendTelegram(`AO EXECUTOR FOUT: backend niet bereikbaar\n${err.message}`)
  }
}

// Telegram listener
async function listenTelegram() {
  try {
    const cmd = await handleTelegramCommand()
    if (cmd) {
      await sendTelegram(`Commando ontvangen: ${cmd}`)
      console.log("Telegram commando:", cmd)
    }
  } catch (err) {
    console.error("Telegram listener fout:", err.message)
  }
}

// Hoofdloop
async function loop() {
  await selfPing()
  await listenTelegram()
}

// Start executor
setInterval(loop, SELF_PING_INTERVAL)

console.log("AO Executor draait en luistert naar backend + telegram…")
