<?php /* FILE: backend/api/routes/uren.js — VOLLEDIG BESTAND */ ?>

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
   POST — Nieuwe urenregistratie
----------------------------------------------------------- */
router.post("/add", async (req, res) => {
  const { project_id, werknemer, taak, datum, uren } = req.body

  if (!project_id || !werknemer || !datum || !uren) {
    return res.status(400).json({ error: "verplichte velden ontbreken" })
  }

  const { data, error } = await supabase
    .from("urenregistratie")
    .insert([
      {
        project_id,
        werknemer,
        taak,
        datum,
        uren
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ saved: true, uren: data[0] })
})

/* -----------------------------------------------------------
   GET — Alle uren van een project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("urenregistratie")
    .select("*")
    .eq("project_id", project_id)
    .order("datum", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ uren: data })
})

/* -----------------------------------------------------------
   GET — Samenvatting totalen
----------------------------------------------------------- */
router.get("/totaal", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("urenregistratie")
    .select("uren")

  if (error) return res.status(500).json({ error: error.message })

  const totaal = data.reduce((sum, row) => sum + row.uren, 0)

  res.json({ totaal })
})

export default router
