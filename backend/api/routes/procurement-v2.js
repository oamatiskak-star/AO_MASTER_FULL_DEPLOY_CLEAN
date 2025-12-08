<?php /* FILE: backend/api/routes/procurement-v2.js — VOLLEDIG BESTAND */ ?>

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
   LEVERANCIER TOEVOEGEN
----------------------------------------------------------- */
router.post("/leverancier", async (req, res) => {
  const { naam, email, telefoon, categorie } = req.body

  const { data, error } = await supabase
    .from("leveranciers_v2")
    .insert([
      {
        naam,
        email,
        telefoon,
        categorie
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ added: true, leverancier: data[0] })
})

/* -----------------------------------------------------------
   ONDERAANNEMER TOEVOEGEN
----------------------------------------------------------- */
router.post("/onderaannemer", async (req, res) => {
  const { naam, kvk, email, telefoon, discipline } = req.body

  const { data, error } = await supabase
    .from("onderaannemers_v2")
    .insert([
      {
        naam,
        kvk,
        email,
        telefoon,
        discipline
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ added: true, onderaannemer: data[0] })
})

/* -----------------------------------------------------------
   OFFERTE AANVRAGEN (AI TEKST + OPSLAAN)
----------------------------------------------------------- */
router.post("/offerte-aanvraag", async (req, res) => {
  const { project_id, leverancier_id, beschrijving } = req.body

  const prompt = `
Je bent een AI-inkoopmanager.
Schrijf een professionele offerteaanvraag voor het volgende projectonderdeel.

Project ID: ${project_id}
Beschrijving: ${beschrijving}

Output in nette mailtekst.
  `

  const aiResp = await fetch(process.env.AO_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AO_AI_KEY
    },
    body: JSON.stringify({ prompt })
  })

  const mailText = await aiResp.text()

  const { data, error } = await supabase
    .from("offerteaanvragen_v2")
    .insert([
      {
        project_id,
        leverancier_id,
        beschrijving,
        mail_tekst: mailText
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    generated: true,
    aanvraag: data[0]
  })
})

/* -----------------------------------------------------------
   FACTUURCONTROLE (AI)
----------------------------------------------------------- */
router.post("/factuurcontrole", async (req, res) => {
  const { project_id, factuur_data, contract_data } = req.body

  const prompt = `
Je bent een AI financiële controller.
Controleer deze factuur op juistheid conform contract.

FACTUUR:
${JSON.stringify(factuur_data, null, 2)}

CONTRACT:
${JSON.stringify(contract_data, null, 2)}

Lever in JSON:

{
  "correct": true/false,
  "opmerkingen": [],
  "verschillen": [],
  "advies": ""
}
  `

  const aiResp = await fetch(process.env.AO_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AO_AI_KEY
    },
    body: JSON.stringify({ prompt })
  })

  const text = await aiResp.text()

  const code = Buffer.from(text).toString("base64")
  const storage = `procurement_v2/${project_id}/factuurcontrole-${Date.now()}.json`

  await supabase.storage
    .from("documents")
    .upload(storage, code, {
      contentType: "application/json",
      upsert: false
    })

  const { data: url } = supabase.storage
    .from("documents")
    .getPublicUrl(storage)

  const { data, error } = await supabase
    .from("factuurcontrole_v2")
    .insert([
      {
        project_id,
        result_url: url.publicUrl
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ checked: true, url: url.publicUrl })
})

/* -----------------------------------------------------------
   LEVERBON UPLOAD
----------------------------------------------------------- */
router.post("/leverbon", async (req, res) => {
  const { project_id, leverancier_id, url, beschrijving } = req.body

  const { data, error } = await supabase
    .from("leverbonnen_v2")
    .insert([
      { project_id, leverancier_id, url, beschrijving }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ saved: true, bon: data[0] })
})


/* -----------------------------------------------------------
   GET — INKOOP OVERZICHT PER PROJECT
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const [aanvragen, facturen, bonnen] = await Promise.all([
    supabase
      .from("offerteaanvragen_v2")
      .select("*")
      .eq("project_id", project_id),
    supabase
      .from("factuurcontrole_v2")
      .select("*")
      .eq("project_id", project_id),
    supabase
      .from("leverbonnen_v2")
      .select("*")
      .eq("project_id", project_id)
  ])

  res.json({
    aanvragen: aanvragen.data || [],
    facturen: facturen.data || [],
    bonnen: bonnen.data || []
  })
})

export default router
