<?php /* FILE: backend/api/routes/juridisch-v2.js — VOLLEDIG BESTAND */ ?>

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
   POST — Juridisch document genereren (AI)
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id, type, parameters } = req.body

  if (!project_id || !type || !parameters) {
    return res.status(400).json({ error: "project_id, type en parameters verplicht" })
  }

  const prompt = `
Je bent een Nederlands juridisch specialist bouwrecht.
Genereer het volgende document:

TYPE DOCUMENT:
${type}

PARAMETERS:
${JSON.stringify(parameters, null, 2)}

STRUCTUUR:
- Titel
- Partijen
- Feitenrelaas
- Juridische onderbouwing (samengevat en werkbaar)
- Artikelverwijzingen (Wkb, BW 7:750, UAV 2012, algemene begrippen)
- Officiële formulering
- Slotbepalingen
- Ondertekening

Lever uitsluitend tekst, geen uitleg.
`

  const aiResponse = await fetch(process.env.AO_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AO_AI_KEY
    },
    body: JSON.stringify({ prompt })
  })

  const tekst = await aiResponse.text()

  /* -----------------------------------------------------------
     PDF genereren
  ----------------------------------------------------------- */

  const pdfPath = `/tmp/juridisch-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text(type, { underline: true })
  pdf.moveDown()
  pdf.fontSize(12).text(tekst)
  pdf.end()

  await new Promise(resolve => stream.on("finish", resolve))

  const pdfBuffer = fs.readFileSync(pdfPath)

  const storagePath = `juridisch_v2/${project_id}/${Date.now()}.pdf`

  await supabase.storage
    .from("documents")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false
    })

  const { data: urlData } = supabase.storage
    .from("documents")
    .getPublicUrl(storagePath)

  const { data: saved, error } = await supabase
    .from("juridisch_v2")
    .insert([
      {
        project_id,
        type,
        pdf_url: urlData.publicUrl
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
   GET — Alle juridische documenten
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("juridisch_v2")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ documenten: data })
})

export default router
