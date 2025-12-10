import axios from "axios"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { sendTelegram } from "./telegram.js"
import { handleTelegramCommand } from "./telegramCommands.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ---------------------------------------------------
// CONFIG
// ---------------------------------------------------
const BACKEND = process.env.BACKEND_URL
const FRONTEND = process.env.FRONTEND_URL
const EXECUTOR = process.env.EXECUTOR_URL

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.log("Telegram settings ontbreken")
}

// ---------------------------------------------------
// SELF LOGGING
// ---------------------------------------------------
const logFile = path.join(__dirname, "executor.log")

function writeLog(line) {
  const timestamp = new Date().toISOString()
  fs.appendFileSync(logFile, `[${timestamp}] ${line}\n`)
}

// ---------------------------------------------------
// TELEGRAM POLLING
// ---------------------------------------------------
let offset = 0

async function pollTelegram() {
  try {
    const res = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${offset}`
    )

    if (res.data.result && res.data.result.length > 0) {
      for (const update of res.data.result) {
        offset = update.update_id + 1

        const message = update.message?.text
        if (message) {
          writeLog("Command ontvangen: " + message)
          await handleTelegramCommand(message)
        }
      }
    }
  } catch (err) {
    writeLog("Telegram error: " + err.message)
  }
}

// ---------------------------------------------------
// SELF-PING BACKEND
// ---------------------------------------------------
async function selfPing() {
  try {
    const res = await axios.get(BACKEND + "/api/ping")
    writeLog("Self-ping OK")
  } catch (err) {
    writeLog("Self-ping fout: " + err.message)
    await sendTelegram("AO Executor verloor contact met backend:\n" + err.message)
  }
}

// ---------------------------------------------------
// MAIN EXECUTOR LOOP
// ---------------------------------------------------
async function executorLoop() {
  writeLog("Executor loop actief")
}

// ---------------------------------------------------
// INTERVALS
// ---------------------------------------------------
setInterval(pollTelegram, 1500)
setInterval(selfPing, 30000)
setInterval(executorLoop, 5000)

writeLog("AO EXECUTOR GESTART")
console.log("AO EXECUTOR GESTART — LISTENING")
