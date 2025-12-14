import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import routes from "./routes/index.js"

const app = express()

/* =======================
MIDDLEWARE
======================= */
app.use(cors())
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ extended: true }))

/* =======================
ROOT
– Backend leeft
– Geen Cannot GET /
======================= */
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "STERKBOUW SAAS BACKEND",
    status: "online"
  })
})

/* =======================
PING
– Health check Render
– Health check Executor
======================= */
app.get("/ping", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "STERKBOUW SAAS BACKEND",
    cloud: true,
    timestamp: Date.now()
  })
})

/* =======================
WEBHOOK
– AO / Executor / GitHub
======================= */
app.post("/webhook", (req, res) => {
  console.log("Webhook ontvangen", {
    event: req.headers["x-github-event"],
    delivery: req.headers["x-github-delivery"]
  })
  res.status(200).send("ok")
})

/* =======================
API
– Alle modules automatisch geladen
======================= */
app.use("/api", routes)

/* =======================
FALLBACK
– Geen 404 spam
======================= */
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Route bestaat niet"
  })
})

/* =======================
START
======================= */
const PORT = process.env.PORT || 10000

app.listen(PORT, "0.0.0.0", () => {
  console.log("AO CLOUD draait op poort " + PORT)
})
