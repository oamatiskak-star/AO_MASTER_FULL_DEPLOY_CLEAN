import express from "express"
const router = express.Router()

router.get("/", async (req, res) => {
  res.json([
    {
      id: 1,
      project: "Breskens",
      type: "STABU",
      status: "Concept"
    },
    {
      id: 2,
      project: "Hilversum",
      type: "Fixed Price",
      status: "Definitief"
    }
  ])
})

export default router
