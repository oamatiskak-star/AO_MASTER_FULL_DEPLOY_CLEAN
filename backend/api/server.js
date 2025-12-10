import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"

// bestaande routers
import calcRouter from "./routes/calc.js"
import fixedPriceRouter from "./routes/fixedprice.js"
import leveranciersRouter from "./routes/leveranciers.js"

// nieuwe: projects
import projectsRouter from "./routes/projects.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/ping", (req, res) => {
res.json({ status: "ok", time: Date.now() })
})

// bestaande routes
app.use("/api/calc", calcRouter)
app.use("/api/fixedprice", fixedPriceRouter)
app.use("/api/leveranciers", leveranciersRouter)

// nieuwe projects-route
app.use("/api/projects", projectsRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, "0.0.0.0", () => {
console.log("AO Backend draait op poort " + PORT)
})
