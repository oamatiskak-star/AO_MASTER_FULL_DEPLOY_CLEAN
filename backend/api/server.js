import * as dotenv from "dotenv"
dotenv.config({ path: "./.env" })

import express from "express"
import compression from "compression"
import apicache from "apicache"

// import alle routes
import juridischV2Router from "./routes/juridisch-v2.js"

const app = express()
app.use(express.json())

// caching
let cache = apicache.middleware
app.use(cache("10 minutes"))

// compressie
app.use(compression())

// headers
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=600")
  next()
})

// routes
app.use("/api/juridisch-v2", juridischV2Router)

const PORT = process.env.PORT || 4000
app.listen(PORT, "0.0.0.0", () => {
  console.log("Backend draait op poort: " + PORT)
})
