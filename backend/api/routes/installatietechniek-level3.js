<?php /* FILE: backend/api/routes/installatietechniek-level3.js — VOLLEDIG BESTAND */ ?>

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
   HELPER: LAAD INSTALLATIE + ARCHITECT DATA
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
    architect: await load("architect_v2", project_id),
    architect3: await load("architect_v3", project_id),
    install_v2: await load("installatie_v2", project_id),
    calc: await load("calc_engine_v2", project_id),
    uitvoering: await load("uitvoering_v2", project_id),
    planning: await load("planning", project_id),
    kosten: await load("kosten", project_id)
  }
}

/* -----------------------------------------------------------
   POST — GENERATE INSTALLATION MODEL L3
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id } = req.body

  if (!project_id)
    return res.status(400).json({ error: "project_id verplicht" })

  const payload = await loadAll(project_id)

  /* -----------------------------------------------------------
     AI INSTALLATIEMODEL GENERATIE L3
----------------------------------------------------------- */
  const prompt = `
Je bent een Installatietechniek AI Level 3-engineer.

GENEREER EEN COMPLEET INSTALLATIEMODEL:

STRUCTUUR:

{
  "metadata": {
    "project_id": "",
    "versie": "L3",
    "bim_export_ready": true
  },
  "kabels": [],
  "leidingen": [],
  "ventilatie": [],
  "piping_routes": [],
  "kW_verdeling": [],
  "warmteverlies": [],
  "waarschuwingen": [],
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

  const installJson = await aiResp.text()

  /* -----------------------------------------------------------
     JSON INSTALLATION MODEL OPSLAAN
----------------------------------------------------------- */
  const jsonEncoded = Buffer.from(installJson).toString("base64")
  const jsonPath = `install_level3/${project_id}/install-${Date.now()}.json`

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
     IFC EXPORT (INSTALLATION MODEL)
----------------------------------------------------------- */
  const ifcPath = `/tmp/install-${Date.now()}.ifc`
  fs.writeFileSync(ifcPath, installJson)

  const ifcBuff = fs.readFileSync(ifcPath)
  const ifcStorage = `install_level3/${project_id}/install-${Date.now()}.ifc`

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
     DWG EXPORT (SIMULATIE)
----------------------------------------------------------- */
  const dwgPath = `/tmp/install-${Date.now()}.dwg`
  fs.writeFileSync(dwgPath, installJson)

  const dwgBuff = fs.readFileSync(dwgPath)
  const dwgStorage = `install_level3/${project_id}/install-${Date.now()}.dwg`

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
     PDF OVERZICHT
----------------------------------------------------------- */
  const pdfPath = `/tmp/install-preview-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text("Installatietechniek Level 3 — Model Preview", {
    underline: true
  })

  pdf.moveDown()
  pdf.fontSize(12).text(installJson)
  pdf.end()

  await new Promise(resolve => stream.on("finish", resolve))

  const pdfBuff = fs.readFileSync(pdfPath)
  const pdfStorage = `install_level3/${project_id}/preview-${Date.now()}.pdf`

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
    .from("install_level3")
    .insert([
      {
        project_id,
        json_url: urlJson.publicUrl,
        ifc_url: urlIfc.publicUrl,
        dwg_url: urlDwg.publicUrl,
        pdf_url: urlPdf.publicUrl
      }
    ])
    .select("*")

  res.json({
    generated: true,
    model: saved[0],
    links: {
      json: urlJson.publicUrl,
      ifc: urlIfc.publicUrl,
      dwg: urlDwg.publicUrl,
      pdf: urlPdf.publicUrl
    }
  })
})

/* -----------------------------------------------------------
   GET — INSTALLATIEMODELLEN PER PROJECT
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data } = await supabase
    .from("install_level3")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  res.json({ modellen: data })
})

export default router
