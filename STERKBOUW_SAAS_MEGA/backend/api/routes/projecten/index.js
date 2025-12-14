import express from "express"
const router = express.Router()

router.get("/", async (req, res) => {
  res.json([
    {
      id: 1,
      naam: "Breskens",
      status: "In uitvoering",
      budget: 2600000
    },
    {
      id: 2,
      naam: "Hilversum",
      status: "Ontwerp",
      budget: 1400000
    }
  ])
})

export default router
