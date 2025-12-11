<?php /* FILE: backend/api/routes/bouwbesluit.js — VOLLEDIG BESTAND */ ?>

import express from "express"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   Bouwbesluit regels (Level 1)
   Deze regels worden straks AI-gestuurd bij Level 2.
----------------------------------------------------------- */
const regels = [
  {
    id: "daglicht",
    titel: "Daglichttoetreding",
    minimumFactor: 0.1,
    check: (ruimtes) => {
      let fails = []
      ruimtes.forEach(r => {
        const daglichtOppervlak = r.raam_m2 || 0
        const eis = r.oppervlakte * 0.1
        if (daglichtOppervlak < eis) {
          fails.push({
            ruimte: r.naam,
            eis: eis.toFixed(2),
            waarde: daglichtOppervlak
          })
        }
      })
      return fails
    }
  },
  {
    id: "ventilatie",
    titel: "Ventilatiecapaciteit",
    minimumFactor: 3.5,
    check: (ruimtes) => {
      let fails = []
      ruimtes.forEach(r => {
        const capaciteit = r.ventilatie || 0
        const eis = r.oppervlakte * 3.5
        if (capaciteit < eis) {
          fails.push({
            ruimte: r.naam,
            eis: eis.toFixed(2),
            waarde: capaciteit
          })
        }
      })
      return fails
    }
  },
  {
    id: "brandveiligheid",
    titel: "Brandcompartiment - Max 500 m2",
    maxOppervlakte: 500,
    check: (ruimtes) => {
      let totaal = 0
      ruimtes.forEach(r => { totaal += r.oppervlakte })
      if (totaal > 500) {
        return [{
          ruimte: "Gehele verdieping",
          eis: 500,
          waarde: totaal
        }]
      }
      return []
    }
  }
]

/* -----------------------------------------------------------
   POST — Controleer bouwbesluit op basis van blueprint JSON
----------------------------------------------------------- */
router.post("/check", async (req, res) => {
  const { project_id } = req.body

  if (!project_id) {
    return res.status(400).json({ error: "project_id ontbreekt" })
  }

  // Haal blueprint op
  const { data: bp, error: bpErr } = await supabase
    .from("architect_blueprints")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })
    .limit(1)

  if (bpErr) return res.status(500).json({ error: bpErr.message })
  if (!bp.length) return res.json({ checks: [], ok: false, message: "Geen blueprint gevonden" })

  const blueprint = bp[0].blueprint_json
  const ruimtes = blueprint.ruimtes || []

  let resultaten = []

  regels.forEach(rule => {
    const fails = rule.check(ruimtes)
    resultaten.push({
      regel: rule.titel,
      ok: fails.length === 0,
      fails
    })
  })

  // Opslaan in database
  const { data, error } = await supabase
    .from("bouwbesluit_checks")
    .insert([
      {
        project_id,
        resultaten
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    checked: true,
    resultaten: data[0]
  })
})

/* -----------------------------------------------------------
   GET — Haal alle checks voor project op
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("bouwbesluit_checks")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ checks: data })
})

export default router
