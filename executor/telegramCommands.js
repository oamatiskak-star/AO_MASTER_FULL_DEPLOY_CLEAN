import axios from "axios"
import { sendTelegram } from "./telegram.js"

const BACKEND = process.env.BACKEND_URL
const FRONTEND = process.env.FRONTEND_URL
const EXECUTOR = process.env.EXECUTOR_URL

export async function handleTelegramCommand(text) {
  const cmd = text.trim().toLowerCase()

  // STATUS
  if (cmd === "ao status") {
    await sendTelegram(
      "AO Status:\n" +
      "Backend: " + BACKEND + "\n" +
      "Frontend: " + FRONTEND + "\n" +
      "Executor: " + EXECUTOR
    )
    return
  }

  // PING
  if (cmd === "ao ping") {
    try {
      const res = await axios.get(BACKEND + "/api/ping")
      await sendTelegram("Ping OK: " + JSON.stringify(res.data))
    } catch (err) {
      await sendTelegram("Ping fout: " + err.message)
    }
    return
  }

  // ROUTES
  if (cmd === "ao routes") {
    try {
      const res = await axios.get(BACKEND + "/api/modules")
      await sendTelegram("Routes geladen:\n" + JSON.stringify(res.data))
    } catch (err) {
      await sendTelegram("Route fout: " + err.message)
    }
    return
  }

  // FIXED PRICE TEST
  if (cmd === "ao fixedprice test") {
    try {
      const res = await axios.get(BACKEND + "/api/fixedprice/test")
      await sendTelegram("FP Test OK:\n" + JSON.stringify(res.data))
    } catch (err) {
      await sendTelegram("FP Test fout:\n" + err.message)
    }
    return
  }

  // CALC TEST
  if (cmd === "ao calc test") {
    try {
      const res = await axios.get(BACKEND + "/api/calc/test")
      await sendTelegram("Calc OK:\n" + JSON.stringify(res.data))
    } catch (err) {
      await sendTelegram("Calc fout:\n" + err.message)
    }
    return
  }

  // DEPLOY FRONTEND
  if (cmd === "ao deploy frontend") {
    await sendTelegram("Frontend deploy wordt gestart...")
    return
  }

  // DEPLOY BACKEND
  if (cmd === "ao deploy backend") {
    await sendTelegram("Backend deploy wordt gestart...")
    return
  }

  // ONBEKEND COMMAND
  await sendTelegram("Onbekend command: " + cmd)
}
