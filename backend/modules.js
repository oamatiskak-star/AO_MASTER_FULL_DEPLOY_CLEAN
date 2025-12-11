import express from "express"
import { runModule } from "../moduleEngine.js"

const router = express.Router()

router.post("/run", async (req, res) => {
  const { task } = req.body

  if (!task) {
    return res.status(400).json({ error: "Geen task" })
  }

  const result = await runModule(task)
  res.json(result)
})

export default router
