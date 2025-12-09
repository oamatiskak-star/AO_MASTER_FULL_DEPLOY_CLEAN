import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"

import executorRoute from "./routes/executor.js"
import modulesRoute from "./routes/modules.js"
import projectsRoute from "./routes/projects.js"
import pingRoute from "./routes/ping.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/executor", executorRoute)
app.use("/api/modules", modulesRoute)
app.use("/api/projects", projectsRoute)
app.use("/api/ping", pingRoute)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log("AO MASTER BACKEND draait op http://localhost:" + PORT)
})
