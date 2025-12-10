import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

// Root endpoint for Render healthchecks
app.get("/", (req, res) => {
  res.json({ ok: true, service: "executor" })
})

// Ping endpoint
app.get("/ping", (req, res) => {
  res.json({ status: "executor online" })
})

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ ok: true, timestamp: Date.now() })
})

// Status endpoint
app.get("/status", (req, res) => {
  res.json({ executor: "running", timestamp: Date.now() })
})

// Execute endpoint
app.post("/execute", async (req, res) => {
  const task = req.body.task

  if (!task) {
    return res.status(400).json({ error: "Geen taak ontvangen" })
  }

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    const url = "https://api.telegram.org/bot" + token + "/sendMessage"

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Taak uitgevoerd: " + task
      })
    })

    res.json({ ok: true, executed: task })

  } catch (err) {
    res.json({ ok: false, error: err.toString() })
  }
})

// Start server (RENDER FIX: MUST BIND TO 0.0.0.0)
const PORT = process.env.PORT || 7070

app.listen(PORT, "0.0.0.0", () => {
  console.log("Executor draait op poort " + PORT)
})

// Heartbeat to avoid Render HTML fallbacks
setInterval(() => {
  const url = "http://localhost:" + PORT + "/ping"
  fetch(url).catch(() => {})
}, 60000)
