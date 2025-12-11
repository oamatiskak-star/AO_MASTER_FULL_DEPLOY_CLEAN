<?php /* FILE: backend/api/routes/calc-level3.js — VOLLEDIG BESTAND */ ?>

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
   helper — data ophalen
----------------------------------------------------------- */
async function load(table, project_id) {
  const { data } = await supabase
    .from(table)
    .select("*")
    .eq("project_id", project_id)
  return data || []
}

async function loadAll(project_id) {
  return {
    architect: await load("architect_v3", project_id),
    install: await load("install_level3", project_id),
    calc_v2: await load("calc_engine_v2", project_id),
    uren: await load("uren", project_id),
    kosten: await load("kosten", project_id),
    inkomsten: await load("inkomsten", project_id),
    inkoop: await load("inkoop", project_id),
    uitvoering: await load("uitvoering_v2", project_id),
    planning: await load("planning", project_id),
    analytics: await load("analytics_v2", project_id),
    financial: await load("financial_v2", project_id)
  }
}

/* -----------------------------------------------------------
   POST — CALCULATIE GENEREREN L3
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id } = req.body

  if (!project_id)
    return res.status(400).json({ error: "project_id verplicht" })

  const payload = await loadAll(project_id)

  const prompt = `
Je bent een Bouwkostendeskundige Level 3.

Genereer een volledige calculatie volgens STABU A logica met AI optimalisaties.

STRUCTUUR:

{
  "directe_kosten": [],
  "materieel": [],
  "materiaalkosten": [],
  "arbeid": [],
  "onderaannemers": [],
  "installaties": [],
  "constructie": [],
  "architectuur": [],
  "algemene_kosten": [],
  "winst": 0,
  "risico": 0,
  "totaal": 0,
  "advies": ""
}

DATA:
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

  const calcJson = await aiResp.text()

  /* -----------------------------------------------------------
     JSON OPSLAAN
----------------------------------------------------------- */
  const jsonEncoded = Buffer.from(calcJson).toString("base64")
  const jsonPath = `calc_level3/${project_id}/calc-${Date.now()}.json`

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
     PDF EXPORT
----------------------------------------------------------- */
  const pdfPath = `/tmp/calc-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text("Calculatie Level 3 — Overzicht", { underline: true })
  pdf.moveDown()
  pdf.fontSize(12).text(calcJson)
  pdf.end()

  await new Promise(resolve => stream.on("finish", resolve))

  const pdfBuff = fs.readFileSync(pdfPath)
  const pdfStorage = `calc_level3/${project_id}/calc-${Date.now()}.pdf`

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
     OPSLAAN IN DATABASE
----------------------------------------------------------- */
  const { data: saved } = await supabase
    .from("calc_level3")
    .insert([
      {
        project_id,
        json_url: urlJson.publicUrl,
        pdf_url: urlPdf.publicUrl
      }
    ])
    .select("*")

  res.json({
    generated: true,
    record: saved[0],
    links: {
      json: urlJson.publicUrl,
      pdf: urlPdf.publicUrl
    }
  })
})

/* -----------------------------------------------------------
   GET — calculaties opvragen
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data } = await supabase
    .from("calc_level3")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  res.json({ calculaties: data })
})

export default router
