<?php /* FILE: backend/api/routes/architect.js — VOLLEDIG BESTAND */ ?>

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
   POST — Genereer plattegrond JSON via AI
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id, wensen } = req.body

  if (!project_id) {
    return res.status(400).json({ error: "project_id ontbreekt" })
  }

  // AI generatie (mock JSON, Level 2 wordt echt AI functionaliteit)
  const blueprint = {
    versie: "1.0",
    ruimtes: [
      { naam: "Woonkamer", breedte: 620, hoogte: 480, x: 0, y: 0 },
      { naam: "Keuken", breedte: 300, hoogte: 200, x: 620, y: 0 },
      { naam: "Badkamer", breedte: 200, hoogte: 200, x: 0, y: 480 },
      { naam: "Slaapkamer", breedte: 400, hoogte: 300, x: 300, y: 480 }
    ]
  }

  const { data, error } = await supabase
    .from("architect_blueprints")
    .insert([
      {
        project_id,
        wensen,
        blueprint_json: blueprint
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    generated: true,
    blueprint: data[0]
  })
})

/* -----------------------------------------------------------
   GET — Haal alle blueprints van een project op
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("architect_blueprints")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ blueprints: data })
})

export default router
