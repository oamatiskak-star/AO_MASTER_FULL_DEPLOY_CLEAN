import express from "express"
const router = express.Router()

router.post("/generate", async (req, res) => {
  const { moduleType, projectId } = req.body

  if (!moduleType || !projectId) {
    return res.status(400).json({ error: "Data mist" })
  }

  res.json({
    ok: true,
    message: "Module-generatie geaccepteerd",
    moduleType,
    projectId
  })
})

export default router
