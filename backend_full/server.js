
import express from "express"
import authRoutes from "./routes/auth.js"
import projectRoutes from "./routes/projects.js"
import calcRoutes from "./routes/calculations.js"
import { errorHandler } from "./middleware/errorHandler.js"

const app = express()
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/projects", projectRoutes)
app.use("/calculations", calcRoutes)

app.use(errorHandler)

app.listen(4000, () => console.log("Backend draait op poort 4000"))
