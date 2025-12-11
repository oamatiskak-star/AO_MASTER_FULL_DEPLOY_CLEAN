<?php /* FILE: backend/api/routes/uitvoering-v2.js — VOLLEDIG BESTAND */ ?>

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
   POST — Dagrapport genereren (PDF + opslag)
----------------------------------------------------------- */
router.post("/dagrapport", async (req, res) => {
  const { project_id, rapport } = req.body

  if (!project_id || !rapport) {
    return res.status(400).json({ error: "project_id en rapport verplicht" })
  }

  const pdfPath = `/tmp/dagrapport-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text("Dagrapport uitvoering", { underline: true })
  pdf.moveDown()

  pdf.fontSize(14).text("Project ID: " + project_id)
  pdf.moveDown()

  pdf.fontSize(12).text(JSON.stringify(rapport, null, 2))
  pdf.end()

  await new Promise(resolve => stream.on("finish", resolve))

  const buffer = fs.readFileSync(pdfPath)

  const storagePath = `uitvoering_v2/${project_id}/dagrapport-${Date.now()}.pdf`

  await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: false
    })

  const { data: publicUrl } = supabase.storage
    .from("documents")
    .getPublicUrl(storagePath)

  const { data: saved, error } = await supabase
    .from("uitvoering_v2")
    .insert([
      {
        project_id,
        type: "dagrapport",
        pdf_url: publicUrl.publicUrl
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    created: true,
    link: publicUrl.publicUrl,
    record: saved[0]
  })
})


/* -----------------------------------------------------------
   POST — Werkbon genereren
----------------------------------------------------------- */
router.post("/werkbon", async (req, res) => {
  const { project_id, bon } = req.body

  if (!project_id || !bon) {
    return res.status(400).json({ error: "project_id en bon verplicht" })
  }

  const pdfPath = `/tmp/werkbon-${Date.now()}.pdf`
  const pdf = new PDFDocument()
  const stream = fs.createWriteStream(pdfPath)
  pdf.pipe(stream)

  pdf.fontSize(20).text("Werkbon", { underline: true })
  pdf.moveDown()

  pdf.fontSize(12).text(JSON.stringify(bon, null, 2))
  pdf.end()

  await new Promise(resolve => stream.on("finish", resolve))

  const buffer = fs.readFileSync(pdfPath)

  const storagePath = `uitvoering_v2/${project_id}/werkbon-${Date.now()}.pdf`

  await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: false
    })

  const { data: publicUrl } = supabase.storage
    .from("documents")
    .getPublicUrl(storagePath)

  const { data: saved, error } = await supabase
    .from("uitvoering_v2")
    .insert([
      {
        project_id,
        type: "werkbon",
        pdf_url: publicUrl.publicUrl
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    created: true,
    link: publicUrl.publicUrl,
    record: saved[0]
  })
})


/* -----------------------------------------------------------
   POST — Foto upload (logboek)
----------------------------------------------------------- */
router.post("/fotolog", async (req, res) => {
  const { project_id, url, beschrijving } = req.body

  if (!project_id || !url) {
    return res.status(400).json({ error: "project_id en url verplicht" })
  }

  const { data: saved, error } = await supabase
    .from("uitvoering_v2")
    .insert([
      {
        project_id,
        type: "foto",
        foto_url: url,
        beschrijving
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    created: true,
    record: saved[0]
  })
})


/* -----------------------------------------------------------
   POST — VGM / LMRA
----------------------------------------------------------- */
router.post("/vgm", async (req, res) => {
  const { project_id, vgm } = req.body

  if (!project_id || !vgm) {
    return res.status(400).json({ error: "project_id en vgm verplicht" })
  }

  const { data: saved, error } = await supabase
    .from("uitvoering_v2")
    .insert([
      {
        project_id,
        type: "vgm",
        data: vgm
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ created: true, record: saved[0] })
})


/* -----------------------------------------------------------
   GET — Alles ophalen per project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("uitvoering_v2")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ uitvoering: data })
})

export default router
