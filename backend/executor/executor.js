import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

// Health routes
app.get("/ping", (req, res) => {
res.json({ status: "executor online" })
})

app.get("/health", (req, res) => {
res.json({ ok: true, timestamp: Date.now() })
})

app.get("/status", (req, res) => {
res.json({ executor: "running", timestamp: Date.now() })
})

// Execute tasks
app.post("/execute", async (req, res) => {
const { task } = req.body

if (!task) {
return res.status(400).json({ error: "Geen taak ontvangen" })
}

try {
const token = process.env.TELEGRAM_BOT_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID

await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: chatId,
    text: `Taak uitgevoerd: ${task}`
  })
})

res.json({ ok: true, executed: task })


} catch (err) {
res.json({ ok: false, error: err.toString() })
}
})

// Start server
const PORT = process.env.PORT || 7070

app.listen(PORT, () => {
console.log("Executor draait op poort " + PORT)
})

// Correct heartbeat ping (LOCAL instead of Render URL)
setInterval(() => {
fetch(http://localhost:${PORT}/ping)
.catch(() => {})
}, 60000)
