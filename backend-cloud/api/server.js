const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const routes = require("./routes")

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use("/api", routes)

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, cloud: true, msg: "AO Cloud Backend actief" })
})

app.listen(4000, () => {
  console.log("AO CLOUD BACKEND draait op poort 4000")
})

