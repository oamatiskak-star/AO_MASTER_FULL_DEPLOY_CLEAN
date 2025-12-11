import http from "http"
import fetch from "node-fetch"

const PORT = process.env.PORT

// simpele JSON response helper
function sendJson(res, obj) {
  const data = JSON.stringify(obj)
  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(data)
}

// incoming requests handler
const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    return sendJson(res, { ok: true, service: "executor" })
  }

  if (req.url === "/ping" && req.method === "GET") {
    return sendJson(res, { status: "executor online" })
  }

  if (req.url === "/health" && req.method === "GET") {
    return sendJson(res, { ok: true, timestamp: Date.now() })
  }

  if (req.url === "/status" && req.method === "GET") {
    return sendJson(res, { executor: "running", timestamp: Date.now() })
  }

  if (req.url === "/execute" && req.method === "POST") {
    let body = ""

    req.on("data", chunk => {
      body += chunk
    })

    req.on("end", async () => {
      try {
        const json = JSON.parse(body)
        const task = json.task

        if (!task) {
          return sendJson(res, { error: "Geen taak ontvangen" })
        }

        const token = process.env.TELEGRAM_BOT_TOKEN
        const chatId = process.env.TELEGRAM_CHAT_ID

        await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "Taak uitgevoerd: " + task
          })
        })

        return sendJson(res, { ok: true, executed: task })
      } catch (err) {
        return sendJson(res, { ok: false, error: err.toString() })
      }
    })

    return
  }

  // default fallback
  sendJson(res, { error: "Unknown route" })
})

// Bind correct for Render
server.listen(PORT, "0.0.0.0", () => {
  console.log("Executor draait op poort " + PORT)
})

// heartbeat
setInterval(() => {
  fetch("http://localhost:" + PORT + "/ping").catch(() => {})
}, 60000)
