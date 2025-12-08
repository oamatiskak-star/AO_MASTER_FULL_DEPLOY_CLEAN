<?php /* FILE: backend/api/routes/architect-v2.js — VOLLEDIG BESTAND */ ?>

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
   POST — AI Plattegrond + Installaties + Constructie genereren
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id, parameters } = req.body

  if (!project_id || !parameters) {
    return res.status(400).json({ error: "project_id en parameters verplicht" })
  }

  const prompt = `
Je bent een architect AI.
Genereer een plattegrond + installatie-indeling + constructielijnen + brandcompartimenten.
Output in gestructureerde JSON.

Project parameters:
${JSON.stringify(parameters, null, 2)}

JSON structuur:
{
  "wanden": [],
  "ramen": [],
  "deuren": [],
  "constructie_lijnen": [],
  "brandcompartimenten": [],
  "installaties": {
    "elektra": [],
    "water": [],
    "ventilatie": []
  }
}
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

  const filepath = `architect_v2/${project_id}/${Date.now()}.json`

  await supabase.storage
    .from("documents")
    .upload(filepath, encoded, {
      contentType: "application/json",
      upsert: false
    })

  const { data: fileData } = supabase.storage
    .from("documents")
    .getPublicUrl(filepath)

  const { data: saved, error } = await supabase
    .from("architect_v2")
    .insert([
      {
        project_id,
        json_url: fileData.publicUrl
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    generated: true,
    link: fileData.publicUrl,
    record: saved[0]
  })
})

/* -----------------------------------------------------------
   GET — Alle ontwerpvarianten ophalen
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("architect_v2")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ ontwerpen: data })
})

/* -----------------------------------------------------------
   GET — JSON variant ophalen
----------------------------------------------------------- */
router.get("/variant", async (req, res) => {
  const { url } = req.query

  const json = await fetch(url).then(r => r.text())

  res.json(JSON.parse(json))
})

export default router
