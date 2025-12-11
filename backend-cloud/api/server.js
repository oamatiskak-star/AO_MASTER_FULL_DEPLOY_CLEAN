const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const routes = require("./routes")

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
res.json({ ok: true, cloud: true, msg: "AO Cloud Backend actief" })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, "0.0.0.0", () => {
console.log("AO CLOUD BACKEND draait op poort " + PORT)
})
