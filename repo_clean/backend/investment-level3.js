<?php /* FILE: backend/api/routes/investment-level3.js — VOLLEDIG BESTAND */ ?>

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
   DATA LADEN PER PROJECT
----------------------------------------------------------- */
async function load(table, project_id) {
  const { data } = await supabase
    .from(table)
    .select("*")
    .eq("project_id", project_id)
  return data || []
}

async function gatherInvestmentData(project_id) {
  return {
    calc: await load("calc_level3", project_id),
    inkomsten: await load("inkomsten", project_id),
    kosten: await load("kosten", project_id),
    planning: await load("planning", project_id),
    financial: await load("financial_v2", project_id),
    analytics: await load("analytics_v2", project_id)
  }
}

/* -----------------------------------------------------------
   POST — GENEREER INVESTERING + PORTFOLIO ANALYSE
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id } = req.body
  if (!project_id)
    return res.status(400).json({ error: "project_id verplicht" })

  const payload = await gatherInvestmentData(project_id)

  const prompt = `
Je bent een Investment Analyst Level 3.

Genereer een volledige investeringsanalyse:

STRUCTUUR:

{
  "exploitatie": [],
  "cashflow_maandelijks": [],
  "cashflow_jaarlijks": [],
  "waardestijging": [],
  "yield": 0,
  "roi": 0,
  "irr": 0,
  "dscr": 0,
  "ltv": 0,
  "ltc": 0,
  "waardering": "",
  "scenario_basis": {},
  "scenario_optimistisch": {},
  "scenario_pessimistisch": {},
  "advies": "",
  "samenvatting": ""
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

  const invJson = await aiResp.text()

  /* -----------------------------------------------------------
     JSON OPSLAAN
----------------------------------------------------------- */
  const jsonEncoded = Buffer.from(invJson).toString("base64")
  const jsonPath = `investment_level3/${project_id}/invest-${Date.now()}.json`

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
  const pdfPath = `/tmp/invest-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text("Investment Level 3 — Analyse", {
    underline: true
  })
  pdf.moveDown()
  pdf.fontSize(12).text(invJson)

  pdf.end()
  await new Promise(resolve => stream.on("finish", resolve))

  const pdfBuff = fs.readFileSync(pdfPath)
  const pdfStorage = `investment_level3/${project_id}/invest-${Date.now()}.pdf`

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
    .from("investment_level3")
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
   GET — LIJST INVESTERINGEN PER PROJECT
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data } = await supabase
    .from("investment_level3")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  res.json({ investment: data })
})

export default router
