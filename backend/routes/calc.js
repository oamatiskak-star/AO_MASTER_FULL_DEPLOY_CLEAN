import express from "express"

const router = express.Router()

// Health check endpoint voor testen
router.get("/", (req, res) => {
  res.json({
    ok: true,
    module: "calc",
    message: "Calc module actief"
  })
})

// Voorbeeld van een calculatie-bewerking
router.post("/run", (req, res) => {
  const { input } = req.body

  if (!input) {
    return res.status(400).json({
      ok: false,
      error: "Input ontbreekt"
    })
  }

  const resultaat = {
    invoer: input,
    totaal: input * 2
  }

  res.json({
    ok: true,
    message: "Calculatie uitgevoerd",
    data: resultaat
  })
})

export default router
