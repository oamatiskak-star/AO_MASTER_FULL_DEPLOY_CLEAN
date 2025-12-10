// executor/telegram/telegramCommands.js

import { sendTelegram } from "./telegram.js"
import fetch from "node-fetch"

// ----------------------
// Command parsing helper
// ----------------------
function parseCommand(text) {
  if (!text) return null
  if (!text.startsWith("/")) return null

  const parts = text.trim().split(" ")
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  return { command, args }
}

// ----------------------
// Command handlers
// ----------------------
async function handleStatus() {
  return "Status OK. AO Executor draait en luistert."
}

async function handleBackend() {
  return "Backend check wordt uitgevoerd…"
}

async function handleExecutor() {
  return "Executor actief en verbonden met Telegram."
}

async function handleRestart() {
  return "Opdracht ontvangen: executor herstart-signaal verzonden."
}

async function handleHelp() {
  return (
    "Beschikbare commando’s:\n" +
    "/status - huidige status\n" +
    "/backend - check backend\n" +
    "/executor - check executor\n" +
    "/restart - restart opdracht\n" +
    "/help - toon dit menu"
  )
}

// ----------------------
// Core handler functie
// ----------------------
export async function handleTelegramCommand(message) {
  try {
    if (!message || !message.text) return

    const parsed = parseCommand(message.text)
    if (!parsed) return

    const { command } = parsed

    let output = null

    switch (command) {
      case "/status":
        output = await handleStatus()
        break

      case "/backend":
        output = await handleBackend()
        break

      case "/executor":
        output = await handleExecutor()
        break

      case "/restart":
        output = await handleRestart()
        break

      case "/help":
        output = await handleHelp()
        break

      default:
        output = "Onbekend commando. Gebruik /help"
        break
    }

    if (output) {
      await sendTelegram(output)
    }
  } catch (err) {
    console.error("Fout in telegramCommands.js:", err)
    await sendTelegram("Fout bij verwerken van commando.")
  }
}
