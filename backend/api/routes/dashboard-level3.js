<?php /* FILE: backend/api/routes/dashboard-level3.js — VOLLEDIG BESTAND */ ?>

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
   helper — tabeldata laden
----------------------------------------------------------- */
async function load(table, project_id) {
  const { data } = await supabase
    .from(table)
    .select("*")
    .eq("project_id", project_id)
  return data || []
}

async function gatherProjectData(project_id) {
  return {
    planning: await load("planning", project_id),
    uitvoering: await load("uitvoering_v2", project_id),
    kosten: await load("kosten", project_id),
    inkomsten: await load("inkomsten", project_id),
    uren: await load("uren", project_id),
    installaties: await load("install_level3", project_id),
    architectuur: await load("architect_v3", project_id),
    calculaties: await load("calc_level3", project_id),
    analytics: await load("analytics_v2", project_id),
    finance: await load("financial_v2", project_id)
  }
}

/* -----------------------------------------------------------
   GET — Dashboard Level 3 AI analyse
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query
  if (!project_id)
    return res.status(400).json({ error: "project_id verplicht" })

  const payload = await gatherProjectData(project_id)

  const prompt = `
Je bent een Executive Project Control AI.

Genereer een volledige dashboardanalyse Level 3 met:

• Voortgang in procenten
• Verlies / winst voorspelling
• Cashflow-curve
• Kritieke punten
• Doorlooptijd voorspelling
• Risicoanalyse
• Aanbevelingen
• KPI’s
• Bottlenecks
• Uitvoeringsvoortgang
• Installatievoortgang
• AI waarschuwingen

STRUCTUUR:

{
  "voortgang": 0,
  "doorlooptijd": "",
  "cashflow": [],
  "kpi": [],
  "risico": [],
  "aanbevelingen": [],
  "problemen": [],
  "analyse": ""
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

  const dashboardJson = await aiResp.text()

  res.json({
    dashboard: JSON.parse(dashboardJson)
  })
})

export default router
