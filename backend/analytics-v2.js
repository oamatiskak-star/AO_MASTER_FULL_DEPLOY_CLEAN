<?php /* FILE: backend/api/routes/analytics-v2.js — VOLLEDIG BESTAND */ ?>

import express from "express"
import PDFDocument from "pdfkit"
import fs from "fs"
import * as dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   AI ANALYSE GENEREREN
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id } = req.body

  if (!project_id) {
    return res.status(400).json({ error: "project_id verplicht" })
  }

  /* -----------------------------------------------------------
     1. LAAD ALLE PROJECTDATA
  ----------------------------------------------------------- */
  async function load(table) {
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("project_id", project_id)
    return data || []
  }

  const architect = await load("architect_v2")
  const calculaties = await load("calc_engine_v2")
  const installaties = await load("installatie_v2")
  const uitvoering = await load("uitvoering_v2")
  const kosten = await load("kosten")
  const inkomsten = await load("inkomsten")
  const planning = await load("planning")

  const payload = {
    architect,
    calculaties,
    installaties,
    uitvoering,
    kosten,
    inkomsten,
    planning
  }

  /* -----------------------------------------------------------
     2. STUUR ALLES NAAR AI
  ----------------------------------------------------------- */
  const prompt = `
Je bent een bouwproject AI-analist.
Analyseer ALLE aangeleverde projectdata.

LEVER STRICTE JSON:

{
  "risicos": [],
  "vertraging_voorspelling": "",
  "cashflow_voorspelling": "",
  "budget_analyse": {
    "gepland": 0,
    "werkelijk": 0,
    "verschil": 0
  },
  "voortgang_percentage": 0,
  "kritieke_punten": [],
  "advies": ""
}

DATA:
${JSON.stringify(payload, null, 2)}
  `

  const aiResponse = await fetch(process.env.AO_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AO_AI_KEY
    },
    body: JSON.stringify({ prompt })
  })

  const analysisText = await aiResponse.text()

  /* -----------------------------------------------------------
     3. OPSLAAN IN SUPABASE
  ----------------------------------------------------------- */

  const jsonEncoded = Buffer.from(analysisText).toString("base64")
  const pathJson = `analytics_v2/${project_id}/${Date.now()}.json`

  await supabase.storage
    .from("documents")
    .upload(pathJson, jsonEncoded, {
      contentType: "application/json",
      upsert: false
    })

  const { data: urlJson } = supabase.storage
    .from("documents")
    .getPublicUrl(pathJson)

  const { data: saved, error } = await supabase
    .from("analytics_v2")
    .insert([
      {
        project_id,
        json_url: urlJson.publicUrl
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  /* -----------------------------------------------------------
     4. PDF RAPPORT
  ----------------------------------------------------------- */
  const pdfPath = `/tmp/rapport-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text("AI Project Analyse", { underline: true })
  pdf.moveDown()
  pdf.fontSize(12).text(analysisText)
  pdf.end()

  await new Promise(resolve => stream.on("finish", resolve))

  const buffer = fs.readFileSync(pdfPath)

  const pathPdf = `analytics_v2/${project_id}/rapport-${Date.now()}.pdf`

  await supabase.storage
    .from("documents")
    .upload(pathPdf, buffer, {
      contentType: "application/pdf",
      upsert: false
    })

  const { data: urlPdf } = supabase.storage
    .from("documents")
    .getPublicUrl(pathPdf)

  res.json({
    generated: true,
    json: urlJson.publicUrl,
    pdf: urlPdf.publicUrl,
    record: saved[0]
  })
})


/* -----------------------------------------------------------
   GET — ALLE ANALYSES PER PROJECT
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("analytics_v2")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ analyses: data })
})

export default router
