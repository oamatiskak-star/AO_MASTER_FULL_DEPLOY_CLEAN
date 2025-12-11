<?php /* FILE: backend/api/routes/installatie.js — VOLLEDIG BESTAND */ ?>

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
   LEVEL 1 REGELS VOOR INSTALLATIETECHNIEK
----------------------------------------------------------- */

function berekenElektrisch(ruimtes) {
  let totalVermogen = 0
  let groepen = []

  ruimtes.forEach((r, i) => {
    // Regel: per ruimte minimaal 500W + 10W/m2
    const vermogen = 500 + r.oppervlakte * 10
    totalVermogen += vermogen

    groepen.push({
      ruimte: r.naam,
      vermogen,
      groep: `G${i + 1}`
    })
  })

  return { totaal: totalVermogen, groepen }
}

function berekenWater(ruimtes) {
  let aansluitpunten = []

  ruimtes.forEach((r) => {
    if (r.naam.toLowerCase().includes("badkamer")) {
      aansluitpunten.push({
        ruimte: r.naam,
        koud: 1,
        warm: 1,
        afvoer: 1
      })
    }
    if (r.naam.toLowerCase().includes("keuken")) {
      aansluitpunten.push({
        ruimte: r.naam,
        koud: 1,
        warm: 1,
        afvoer: 1
      })
    }
  })

  return { aansluitpunten }
}

/* -----------------------------------------------------------
   POST — GENERATE INSTALLATION PLAN
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id } = req.body

  if (!project_id) {
    return res.status(400).json({ error: "project_id ontbreekt" })
  }

  // Blueprint ophalen
  const { data: bp, error: bpErr } = await supabase
    .from("architect_blueprints")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })
    .limit(1)

  if (bpErr) return res.status(500).json({ error: bpErr.message })
  if (!bp.length) return res.json({ ok: false, message: "Geen blueprint gevonden" })

  const ruimtes = bp[0].blueprint_json.ruimtes || []

  // ELEKTRA
  const elektra = berekenElektrisch(ruimtes)

  // WATER / AFVOER
  const water = berekenWater(ruimtes)

  const result = {
    elektra,
    water,
    timestamp: new Date().toISOString()
  }

  // Opslaan in database
  const { data, error } = await supabase
    .from("installaties")
    .insert([{ project_id, result }])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    generated: true,
    installaties: data[0]
  })
})

/* -----------------------------------------------------------
   GET — Haal alle installaties van project op
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("installaties")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ installaties: data })
})

export default router
