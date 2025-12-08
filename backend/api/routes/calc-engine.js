<?php /* FILE: backend/api/routes/calc-engine.js — VOLLEDIG BESTAND */ ?>

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
   POST — Automatisch STABU calculatie genereren
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id, omschrijving, m2, eisen } = req.body

  if (!project_id || !omschrijving) {
    return res.status(400).json({ error: "project_id en omschrijving verplicht" })
  }

  // AI STABU GENERATOR (LEVEL 1 TEMPLATE)
  // Level 2 wordt jouw echte AI-engine.
  const stabu = [
    {
      hoofdstuk: "21", 
      titel: "Aard- en grondwerk",
      posten: [
        {
          code: "21.11",
          omschrijving: "Uitgraven bouwput",
          eenheid: "m3",
          hoeveelheid: m2 * 0.5,
          materiaal: 0,
          arbeid: 12 * (m2 * 0.5)
        }
      ]
    },
    {
      hoofdstuk: "31",
      titel: "Funderingen",
      posten: [
        {
          code: "31.32",
          omschrijving: "Betonfundering incl. bekisting",
          eenheid: "m3",
          hoeveelheid: m2 * 0.25,
          materiaal: 150 * (m2 * 0.25),
          arbeid: 45 * (m2 * 0.25)
        }
      ]
    },
    {
      hoofdstuk: "41",
      titel: "Ruwbouw",
      posten: [
        {
          code: "41.21",
          omschrijving: "Buitenmuren metselwerk",
          eenheid: "m2",
          hoeveelheid: m2 * 2.8,
          materiaal: 32 * (m2 * 2.8),
          arbeid: 18 * (m2 * 2.8)
        }
      ]
    }
  ]

  // Totaal berekening
  let totaalMaterialen = 0
  let totaalArbeid = 0

  stabu.forEach(h => {
    h.posten.forEach(p => {
      totaalMaterialen += p.material * 1
      totaalArbeid += p.arbeid * 1
    })
  })

  const subtotal = totaalMaterialen + totaalArbeid
  const opslag = subtotal * 0.07
  const ak = subtotal * 0.04
  const abk = subtotal * 0.03
  const winst = subtotal * 0.05
  const risico = subtotal * 0.03
  const totaal = subtotal + opslag + ak + abk + winst + risico

  const result = {
    project_id,
    omschrijving,
    input_m2: m2,
    input_eisen: eisen,
    stabu,
    totaal: {
      materialen: totaalMaterialen,
      arbeid: totaalArbeid,
      subtotal,
      opslag,
      ak,
      abk,
      winst,
      risico,
      totaal
    }
  }

  const { data, error } = await supabase
    .from("calc_generated")
    .insert([{ project_id, result }])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ generated: true, calculatie: data[0] })
})

/* -----------------------------------------------------------
   GET — alle automatische calculaties van project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("calc_generated")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ auto_calc: data })
})

export default router
