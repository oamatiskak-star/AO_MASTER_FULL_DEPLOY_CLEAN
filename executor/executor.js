import http from "http"
import { sendTelegramMessage } from "./telegram/telegram.js"

const PORT = process.env.PORT || 7070

// kleine helper voor JSON output
function sendJson(res, obj) {
  const json = JSON.stringify(obj)
  res.writeHead(200, { "Content-Type": "application/json" })
  res.end(json)
}

// HTTP SERVER
const server = http.createServer((req, res) => {
  const { url, method } = req

  // ROOT
  if (url === "/" && method === "GET") {
    return sendJson(res, { ok: true, service: "executor" })
  }

  // PING
  if (url === "/ping" && method === "GET") {
    return sendJson(res, { ok: true, status: "executor online" })
  }

  // HEALTH
  if (url === "/health" && method === "GET") {
    return sendJson(res, { ok: true, timestamp: Date.now() })
  }

  // STATUS
  if (url === "/status" && method === "GET") {
    return sendJson(res, { executor: "running", timestamp: Date.now() })
  }

  // EXECUTE TASK
  if (url === "/execute" && method === "POST") {
    let body = ""

    req.on("data", chunk => body += chunk)
    req.on("end", async () => {
      try {
        const json = JSON.parse(body)
        const task = json.task

        if (!task) {
          return sendJson(res, { ok: false, error: "Geen taak ontvangen" })
        }

        await sendTelegramMessage("Taak uitgevoerd: " + task)

        return sendJson(res, { ok: true, executed: task })

      } catch (err) {
        return sendJson(res, { ok: false, error: err.toString() })
      }
    })

    return
  }

  // ONBEKENDE ROUTE
  return sendJson(res, { error: "Unknown route" })
})


// Belangrijk voor Render
server.listen(PORT, "0.0.0.0", () => {
  console.log("Executor draait op poort " + PORT)
})


// Local-only heartbeat
setInterval(() => {
  http.get("http://localhost:" + PORT + "/ping").on("error", () => {})
}, 60000)
