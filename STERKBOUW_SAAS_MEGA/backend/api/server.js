import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import routes from "./routes/index.js"

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post("/webhook", (req, res) => {
  console.log("Webhook ontvangen", {
    event: req.headers["x-github-event"],
    delivery: req.headers["x-github-delivery"]
  })
  res.status(200).send("ok")
})

app.use("/api", routes)

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, cloud: true })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, "0.0.0.0", () => {
  console.log("AO CLOUD draait op poort " + PORT)
})
