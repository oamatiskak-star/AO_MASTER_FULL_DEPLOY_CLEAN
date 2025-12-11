<?php /* FILE: backend/api/routes/calc-engine-v2.js — VOLLEDIG BESTAND */ ?>

import express from "express"
import * as dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"
dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   POST — Generate calculatie op basis van ontwerp of input
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id, parameters } = req.body

  if (!project_id || !parameters) {
    return res.status(400).json({ error: "project_id en parameters verplicht" })
  }

  const prompt = `
Je bent een bouwkosten expert.
Maak een volledige STABU 2023 calculatie.
Inclusief arbeid, materieel, materiaal, uren en tarifering.

INPUT:
${JSON.stringify(parameters, null, 2)}

STRUCTUUR OUTPUT (STRICT JSON):
{
  "stabu": [
    {
      "code": "23.21",
      "omschrijving": "Binnenwanden gips",
      "hoeveelheid": 120,
      "eenheid": "m2",
      "prijs_materiaal": 27.50,
      "prijs_arbeid": 19.75,
      "totaal": 120 * (27.50 + 19.75)
    }
  ],
  "samenvatting": {
    "materiaal": 0,
    "arbeid": 0,
    "overig": 0,
    "totaal": 0
  }
}
Zorg dat samenvatting volledig klopt.
GEEN tekst buiten JSON.
`

  const aiResponse = await fetch(process.env.AO_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AO_AI_KEY
    },
    body: JSON.stringify({ prompt })
  })

  const text = await aiResponse.text()

  // JSON opslaan in storage
  const encoded = Buffer.from(text).toString("base64")
  const filepath = `calc_engine_v2/${project_id}/${Date.now()}.json`

  await supabase.storage
    .from("documents")
    .upload(filepath, encoded, {
      contentType: "application/json",
      upsert: false
    })

  const { data: urlData } = supabase.storage
    .from("documents")
    .getPublicUrl(filepath)

  const { data: saved, error } = await supabase
    .from("calc_engine_v2")
    .insert([
      {
        project_id,
        json_url: urlData.publicUrl
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    generated: true,
    link: urlData.publicUrl,
    record: saved[0]
  })
})

/* -----------------------------------------------------------
   GET — Alle calculaties ophalen
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("calc_engine_v2")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ calculaties: data })
})

/* -----------------------------------------------------------
   GET — Variant ophalen
----------------------------------------------------------- */
router.get("/variant", async (req, res) => {
  const { url } = req.query

  const json = await fetch(url).then(r => r.text())

  res.json(JSON.parse(json))
})

export default router
