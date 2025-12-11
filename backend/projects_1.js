import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
  res.json({ ok: true, projects: [] })
})

router.post("/create", (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ error: "Naam ontbreekt" })
  }

  res.json({
    ok: true,
    message: "Project gemaakt",
    name
  })
})

export default router
