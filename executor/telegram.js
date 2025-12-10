// executor/telegram/telegram.js

import fetch from "node-fetch"
import { handleTelegramCommand } from "./telegramCommands.js"

// ---------------------------------------
// CONFIG
// ---------------------------------------
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

if (!TELEGRAM_TOKEN) {
  console.error("FOUT: TELEGRAM_BOT_TOKEN ontbreekt in environment")
}
if (!CHAT_ID) {
  console.error("FOUT: TELEGRAM_CHAT_ID ontbreekt in environment")
}

// ---------------------------------------
// Sturen van berichten
// ---------------------------------------
export async function sendTelegram(message) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    })
  } catch (err) {
    console.error("Fout bij verzenden Telegram:", err)
  }
}

// ---------------------------------------
// Polling loop — luistert continu
// ---------------------------------------
let lastUpdateId = 0

async function pollTelegram() {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`

    const res = await fetch(url)
    const data = await res.json()

    if (data.result && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id

        if (update.message) {
          await handleTelegramCommand(update.message)
        }
      }
    }
  } catch (err) {
    console.error("Fout in polling:", err)
  }

  // elke 1.5 sec opnieuw
  setTimeout(pollTelegram, 1500)
}

// Start
pollTelegram()
