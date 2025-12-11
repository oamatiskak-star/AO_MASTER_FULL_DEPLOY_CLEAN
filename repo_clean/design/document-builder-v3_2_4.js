<?php /* FILE: backend/api/routes/document-builder-v3.js — VOLLEDIG BESTAND */ ?>

import express from "express"
import * as dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"
import PDFDocument from "pdfkit"
import fs from "fs"

dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   HULPFUNCTIE: LAAD ALLE PROJECTDATA
----------------------------------------------------------- */
async function load(table, project_id) {
  const { data } = await supabase
    .from(table)
    .select("*")
    .eq("project_id", project_id)
  return data || []
}

/* -----------------------------------------------------------
   POST — DOCUMENT GENEREREN
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id, type } = req.body

  if (!project_id || !type) {
    return res.status(400).json({ error: "project_id en type verplicht" })
  }

  /* -----------------------------------------------------------
     1. DATA VERZAMELEN
  ----------------------------------------------------------- */
  const architect = await load("architect_v2", project_id)
  const calc = await load("calc_engine_v2", project_id)
  const installatietechniek = await load("installatie_v2", project_id)
  const planning = await load("planning", project_id)
  const kosten = await load("kosten", project_id)
  const inkomsten = await load("inkomsten", project_id)
  const uitvoering = await load("uitvoering_v2", project_id)
  const analytics = await load("analytics_v2", project_id)
  const financial = await load("financial_v2", project_id)

  const payload = {
    type,
    project_id,
    architect,
    calc,
    installatietechniek,
    planning,
    kosten,
    inkomsten,
    uitvoering,
    analytics,
    financial
  }

  /* -----------------------------------------------------------
     2. AI DOCUMENT GENEREREN
  ----------------------------------------------------------- */
  const prompt = `
Je bent een AI Document Builder voor de bouwsector.
Maak een volledig professioneel document van het type "${type}".

TOON GEEN PLAATSHOUDERS.

STRUCTUUR:

{
  "titel": "",
  "samenvatting": "",
  "inhoudsopgave": [],
  "hoofdstukken": [
    {
      "titel": "",
      "inhoud": ""
    }
  ],
  "advies": ""
}

PROJECTDATA:
${JSON.stringify(payload, null, 2)}
  `

  const aiResp = await fetch(process.env.AO_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AO_AI_KEY
    },
    body: JSON.stringify({ prompt })
  })

  const documentText = await aiResp.text()

  /* -----------------------------------------------------------
     3. DOCUMENT ALS JSON OPSLAAN
  ----------------------------------------------------------- */
  const jsonEncoded = Buffer.from(documentText).toString("base64")
  const jsonPath = `documents_v3/${project_id}/doc-${Date.now()}.json`

  await supabase.storage
    .from("documents")
    .upload(jsonPath, jsonEncoded, {
      contentType: "application/json",
      upsert: false
    })

  const { data: urlJson } = supabase.storage
    .from("documents")
    .getPublicUrl(jsonPath)

  /* -----------------------------------------------------------
     4. DOCUMENT ALS PDF OPSLAAN
  ----------------------------------------------------------- */
  const pdfPath = `/tmp/document-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text("Document: " + type, { underline: true })
  pdf.moveDown()
  pdf.fontSize(12).text(documentText)
  pdf.end()

  await new Promise(resolve => stream.on("finish", resolve))

  const pdfBuff = fs.readFileSync(pdfPath)

  const pdfStorage = `documents_v3/${project_id}/doc-${Date.now()}.pdf`

  await supabase.storage
    .from("documents")
    .upload(pdfStorage, pdfBuff, {
      contentType: "application/pdf",
      upsert: false
    })

  const { data: urlPdf } = supabase.storage
    .from("documents")
    .getPublicUrl(pdfStorage)

  /* -----------------------------------------------------------
     5. OPSLAAN IN DATABASE
  ----------------------------------------------------------- */
  const { data: saved } = await supabase
    .from("documents_v3")
    .insert([
      {
        project_id,
        type,
        json_url: urlJson.publicUrl,
        pdf_url: urlPdf.publicUrl
      }
    ])
    .select("*")

  res.json({
    generated: true,
    type,
    json: urlJson.publicUrl,
    pdf: urlPdf.publicUrl,
    record: saved[0]
  })
})

/* -----------------------------------------------------------
   GET — DOCUMENTEN PER PROJECT
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("documents_v3")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ documenten: data })
})

export default router
