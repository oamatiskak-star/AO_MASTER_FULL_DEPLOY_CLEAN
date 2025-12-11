<?php /* FILE: backend/api/routes/architect-level3.js — VOLLEDIG BESTAND */ ?>

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
   HULP: LAAD PROJECTDATA (architectuur, installaties, planning)
----------------------------------------------------------- */
async function loadData(project_id) {
  async function load(table) {
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("project_id", project_id)
    return data || []
  }

  return {
    architect_v2: await load("architect_v2"),
    installatietechniek_v2: await load("installatie_v2"),
    planning: await load("planning"),
    calculatie: await load("calc_engine_v2"),
    uitvoering: await load("uitvoering_v2")
  }
}

/* -----------------------------------------------------------
   POST — GENERATE BIM / DWG / IFC MODELS
----------------------------------------------------------- */
router.post("/generate-models", async (req, res) => {
  const { project_id } = req.body

  if (!project_id)
    return res.status(400).json({ error: "project_id verplicht" })

  const payload = await loadData(project_id)

  /* -----------------------------------------------------------
     AI BIM MODEL GENERATIE
----------------------------------------------------------- */
  const prompt = `
Je bent een Architect Level 3 AI, gespecialiseerd in BIM, IFC en DWG structuur.

Genereer volledige technische modellering in gestructureerde JSON.

STRUCTUUR:

{
  "metadata": {
    "project_id": "",
    "versie": "",
    "geometrie_type": "3D",
    "bim_export_ready": true
  },
  "bouwlagen": [],
  "wanden": [],
  "ruimtes": [],
  "kozijnen": [],
  "constructie": [],
  "installaties": [],
  "warnings": [],
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

  const modelJson = await aiResp.text()

  /* -----------------------------------------------------------
     JSON BWOGEN OPSLAAN
----------------------------------------------------------- */
  const jsonEncoded = Buffer.from(modelJson).toString("base64")
  const jsonPath = `architect_v3/${project_id}/bim-${Date.now()}.json`

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
     DWG BESTAND GENEREREN (AI SIMULATIE)
----------------------------------------------------------- */
  const dwgPath = `/tmp/model-${Date.now()}.dwg`
  fs.writeFileSync(dwgPath, modelJson)

  const dwgBuff = fs.readFileSync(dwgPath)
  const dwgStorage = `architect_v3/${project_id}/model-${Date.now()}.dwg`

  await supabase.storage
    .from("documents")
    .upload(dwgStorage, dwgBuff, {
      contentType: "application/octet-stream",
      upsert: false
    })

  const { data: urlDwg } = supabase.storage
    .from("documents")
    .getPublicUrl(dwgStorage)

  /* -----------------------------------------------------------
     IFC BESTAND GENEREREN
----------------------------------------------------------- */
  const ifcPath = `/tmp/model-${Date.now()}.ifc`
  fs.writeFileSync(ifcPath, modelJson)

  const ifcBuff = fs.readFileSync(ifcPath)
  const ifcStorage = `architect_v3/${project_id}/model-${Date.now()}.ifc`

  await supabase.storage
    .from("documents")
    .upload(ifcStorage, ifcBuff, {
      contentType: "application/octet-stream",
      upsert: false
    })

  const { data: urlIfc } = supabase.storage
    .from("documents")
    .getPublicUrl(ifcStorage)

  /* -----------------------------------------------------------
     PDF VOORVIEW
----------------------------------------------------------- */
  const pdfPath = `/tmp/preview-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text("Architect Level 3 — Model Preview", { underline: true })
  pdf.moveDown()
  pdf.fontSize(12).text(modelJson)
  pdf.end()

  await new Promise(resolve => stream.on("finish", resolve))

  const pdfBuff = fs.readFileSync(pdfPath)

  const pdfStorage = `architect_v3/${project_id}/preview-${Date.now()}.pdf`

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
    .from("architect_v3")
    .insert([
      {
        project_id,
        json_url: urlJson.publicUrl,
        dwg_url: urlDwg.publicUrl,
        ifc_url: urlIfc.publicUrl,
        pdf_url: urlPdf.publicUrl
      }
    ])
    .select("*")

  res.json({
    generated: true,
    links: {
      json: urlJson.publicUrl,
      dwg: urlDwg.publicUrl,
      ifc: urlIfc.publicUrl,
      pdf: urlPdf.publicUrl
    },
    record: saved[0]
  })
})

/* -----------------------------------------------------------
   GET — MODELLEN PER PROJECT
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("architect_v3")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ modellen: data })
})

export default router
