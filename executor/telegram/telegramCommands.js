// executor/telegram/telegramCommands.js

import { sendTelegram } from "./telegram.js"
import fetch from "node-fetch"

// -------------------------------
// Command parser
// -------------------------------
function parseCommand(text) {
  if (!text) return null
  if (!text.startsWith("/")) return null

  const parts = text.trim().split(" ")
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)

  return { command, args }
}

// -------------------------------
// Commands
// -------------------------------
async function cmdStatus() {
  return "AO Executor draait. Status OK."
}

async function cmdBackend() {
  return "Backend check gestart."
}

async function cmdExecutor() {
  return "Executor actief en verbonden."
}

async function cmdRestart() {
  return "Opdracht ontvangen. Herstart-signaal verzonden."
}

async function cmdHelp() {
  return (
    "Beschikbare commando’s:\n" +
    "/status\n" +
    "/backend\n" +
    "/executor\n" +
    "/restart\n" +
    "/activate_all\n" +
    "/help"
  )
}

async function cmdActivateAll() {
  return (
    "AO start nu volledige activatie van alle modules, koppelingen en functies."
  )
}

// -------------------------------
// Main handler
// -------------------------------
export async function handleTelegramCommand(message) {
  try {
    if (!message || !message.text) return
    const parsed = parseCommand(message.text)
    if (!parsed) return

    const { command } = parsed
    let output = null

    switch (command) {
      case "/status":
        output = await cmdStatus()
        break

      case "/backend":
        output = await cmdBackend()
        break

      case "/executor":
        output = await cmdExecutor()
        break

      case "/restart":
        output = await cmdRestart()
        break

      case "/help":
        output = await cmdHelp()
        break

      case "/activate_all":
        output = await cmdActivateAll()
        break

      default:
        output = "Onbekend commando. Gebruik /help."
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
