import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import routes from "./routes/index.js"

const app = express()

app.use(cors())
app.use(bodyParser.json())

/* =======================
ROOT → SAAS FRONTEND
======================= */
app.get("/", (req, res) => {
  res.redirect("https://app.sterkbouw.nl")
})

/* =======================
PING
======================= */
app.get("/ping", (req, res) => {
  res.json({
    ok: true,
    service: "AO_BACKEND",
    mode: "cloud",
    timestamp: Date.now()
  })
})

/* =======================
GITHUB WEBHOOK
======================= */
app.post("/webhook", (req, res) => {
  console.log("Webhook ontvangen", {
    event: req.headers["x-github-event"],
    delivery: req.headers["x-github-delivery"]
  })
  res.status(200).send("ok")
})

/* =======================
API ROUTES
======================= */
app.use("/api", routes)

/* =======================
START SERVER
======================= */
const PORT = process.env.PORT || 10000

app.listen(PORT, "0.0.0.0", () => {
  console.log("AO CLOUD draait op poort " + PORT)
})
