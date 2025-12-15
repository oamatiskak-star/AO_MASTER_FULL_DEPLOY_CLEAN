import express from "express"

const app = express()
const PORT = process.env.PORT || 10000

app.get("/", (req, res) => {
res.send("STERKBOUW BACKEND LIVE")
})

app.listen(PORT, () => {
console.log("Backend draait op poort", PORT)
})
