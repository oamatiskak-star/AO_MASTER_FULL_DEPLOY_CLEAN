import express from "express"
import axios from "axios"

const router = express.Router()

const EXECUTOR_URL = process.env.EXECUTOR_URL

router.post("/execute", async (req, res) => {
  const { task } = req.body

  if (!task) {
    return res.status(400).json({ error: "Geen taak ontvangen" })
  }

  try {
    const result = await axios.post(`${EXECUTOR_URL}/execute`, { task })
    res.json({ ok: true, executor_response: result.data })
  } catch (err) {
    res.json({ ok: false, error: err.toString() })
  }
})

router.get("/status", async (req, res) => {
  try {
    const r = await axios.get(`${EXECUTOR_URL}/status`)
    res.json(r.data)
  } catch {
    res.json({ ok: false })
  }
})

export default router
