import express from "express"

const router = express.Router()

// Health check endpoint
router.get("/", (req, res) => {
  res.json({
    ok: true,
    module: "fixedprice",
    message: "Fixed Price module actief"
  })
})

// Voorbeeld Fixed Price calculatie endpoint
router.post("/calculate", (req, res) => {
  const { stabu, leverancier, arbeid } = req.body

  if (!stabu || !leverancier || !arbeid) {
    return res.status(400).json({
      ok: false,
      error: "STABU, leverancier of arbeid ontbreekt"
    })
  }

  const totaal =
    Number(stabu || 0) +
    Number(leverancier || 0) +
    Number(arbeid || 0)

  res.json({
    ok: true,
    message: "Fixed price berekend",
    totaal
  })
})

export default router
