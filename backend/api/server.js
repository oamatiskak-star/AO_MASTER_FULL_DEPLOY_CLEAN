import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"

import projectsRoute from "./routes/projects.js"
import executorRoute from "./routes/executor.js"

const app = express()
app.use(cors())
app.use(express.json())

// PROJECTS
app.use("/api/projects", projectsRoute)

// EXECUTOR
app.use("/api/executor", executorRoute)

// PING
app.get("/api/ping", (req, res) => {
res.json({ ok: true })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
console.log("AO MASTER BACKEND draait op http://localhost
:" + PORT)
})
