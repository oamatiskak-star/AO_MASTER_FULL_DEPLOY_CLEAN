<?php /* FILE: backend/api/routes/installatietechniek-v2.js — VOLLEDIG BESTAND */ ?>

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
   POST — AI Installatieberekening genereren
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id, parameters } = req.body

  if (!project_id || !parameters) {
    return res.status(400).json({ error: "project_id en parameters verplicht" })
  }

  const prompt = `
Je bent een installatietechniek specialist.
Maak een volledige E + W + ventilatie + WTW berekening.

STRUCTUUR VAN OUTPUT (strict JSON):
{
  "elektra": {
    "groepen": [],
    "kabels": [],
    "vermogens": [],
    "aansluitwaarde": 0
  },
  "water": {
    "leidingen": [],
    "diameters": [],
    "afvoer": []
  },
  "ventilatie": {
    "debieten": [],
    "kanalen": [],
    "drukverlies": []
  },
  "wtw": {
    "type": "",
    "capaciteit_m3_h": 0,
    "advies": ""
  },
  "samenvatting": {
    "elektra_totaal": 0,
    "water_totaal": 0,
    "ventilatie_totaal": 0,
    "totaal": 0
  }
}

Voer een volledige berekening uit op basis van:
${JSON.stringify(parameters, null, 2)}

Geen tekst buiten JSON.
`

  const aiResponse = await fetch(process.env.AO_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AO_AI_KEY
    },
    body: JSON.stringify({ prompt })
  })

  const jsonText = await aiResponse.text()

  const encoded = Buffer.from(jsonText).toString("base64")

  const filepath = `installatie_v2/${project_id}/${Date.now()}.json`

  await supabase.storage
    .from("documents")
    .upload(filepath, encoded, {
      contentType: "application/json",
      upsert: false
    })

  const { data: publicUrl } = supabase.storage
    .from("documents")
    .getPublicUrl(filepath)

  const { data: saved, error } = await supabase
    .from("installatie_v2")
    .insert([
      {
        project_id,
        json_url: publicUrl.publicUrl
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    generated: true,
    link: publicUrl.publicUrl,
    record: saved[0]
  })
})

/* -----------------------------------------------------------
   GET — Variants ophalen
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("installatie_v2")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ installaties: data })
})

/* -----------------------------------------------------------
   GET — Variant JSON ophalen
----------------------------------------------------------- */
router.get("/variant", async (req, res) => {
  const { url } = req.query

  const json = await fetch(url).then(r => r.text())

  res.json(JSON.parse(json))
})

export default router
