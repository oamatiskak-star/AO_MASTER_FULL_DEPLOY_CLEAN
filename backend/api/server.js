import * as dotenv from "dotenv"
dotenv.config({ path: "./.env" })

import express from "express"
import cors from "cors"

// ------------------ ROUTES IMPORTS ------------------
import pingRoute from "./routes/ping.js"
import modulesRoute from "./routes/modules.js"
import uploadsRoute from "./routes/uploads.js"
import moduleEngineRoute from "./routes/module-engine.js"
import calcRoute from "./routes/calc.js"
import projectsRoute from "./routes/projects.js"
import juridischV2Router from "./routes/juridisch-v2.js"
import testWriteRouter from "./routes/testwrite.js"
// ----------------------------------------------------

const app = express()
app.use(express.json())
app.use(cors())

// ------------------ ACTIVE ROUTES ------------------
app.use("/api/ping", pingRoute)
app.use("/api/modules", modulesRoute)
app.use("/api/uploads", uploadsRoute)
app.use("/api/module-engine", moduleEngineRoute)
app.use("/api/calc", calcRoute)
app.use("/api/projects", projectsRoute)
app.use("/api/juridisch-v2", juridischV2Router)
app.use("/api/testwrite", testWriteRouter)
// ----------------------------------------------------

const PORT = process.env.PORT || 4000

app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend draait op poort: " + PORT)
})
