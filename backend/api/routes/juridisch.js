<?php /* FILE: backend/api/routes/juridisch.js — VOLLEDIG BESTAND */ ?>

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
   POST — Juridisch document genereren via AI
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { type, project_id, data } = req.body

  if (!type || !project_id) {
    return res.status(400).json({ error: "type en project_id verplicht" })
  }

  // AI prompt builder
  const prompt = `
Maak een juridisch document van het type: ${type}.
Gebruik de volgende gegevens:
${JSON.stringify(data, null, 2)}

Maak het formeel, zakelijk, correct Nederlands.
`

  const aiResponse = await fetch(process.env.AO_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AO_AI_KEY
    },
    body: JSON.stringify({ prompt })
  })

  const aiText = await aiResponse.text()

  const { data: saved, error } = await supabase
    .from("juridische_documenten")
    .insert([
      {
        project_id,
        type,
        inhoud: aiText
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ generated: true, document: saved[0] })
})

/* -----------------------------------------------------------
   GET — Alle juridische documenten ophalen per project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("juridische_documenten")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ documenten: data })
})

/* -----------------------------------------------------------
   GET — 1 document ophalen
----------------------------------------------------------- */
router.get("/doc", async (req, res) => {
  const { id } = req.query

  const { data, error } = await supabase
    .from("juridische_documenten")
    .select("*")
    .eq("id", id)
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.json({ document: data })
})

export default router
