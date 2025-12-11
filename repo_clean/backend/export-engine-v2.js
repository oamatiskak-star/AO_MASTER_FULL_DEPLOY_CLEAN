<?php /* FILE: backend/api/routes/export-engine-v2.js — VOLLEDIG BESTAND */ ?>

import express from "express"
import archiver from "archiver"
import PDFDocument from "pdfkit"
import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import * as dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   POST — COMPLETE PROJECT EXPORT (PDF + ZIP)
----------------------------------------------------------- */
router.post("/generate", async (req, res) => {
  const { project_id } = req.body

  if (!project_id) {
    return res.status(400).json({ error: "project_id verplicht" })
  }

  /* -----------------------------------------------------------
     1. DATA OPHALEN vanuit alle modules
  ----------------------------------------------------------- */

  async function load(table) {
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("project_id", project_id)
      .order("created_at", { ascending: false })
    return data || []
  }

  const architect = await load("architect_v2")
  const calculaties = await load("calc_engine_v2")
  const installaties = await load("installatie_v2")
  const planning = await load("planning")
  const offertes = await load("offertes")
  const juridische_docs = await load("juridisch")
  const uitvoering = await load("uitvoering")
  const uren = await load("uren")
  const inkoop = await load("inkoop")
  const kosten = await load("kosten")
  const inkomsten = await load("inkomsten")

  /* -----------------------------------------------------------
     2. PDF BUNDELMAP MAKEN
  ----------------------------------------------------------- */

  const pdfPath = `/tmp/${project_id}-bundel.pdf`
  const pdf = new PDFDocument()
  const pdfStream = fs.createWriteStream(pdfPath)
  pdf.pipe(pdfStream)

  pdf.fontSize(22).text("Project Export Bundel", { underline: true })
  pdf.moveDown()

  pdf.fontSize(16).text("Project ID: " + project_id)
  pdf.moveDown()

  function section(title, items) {
    pdf.fontSize(18).text(title, { underline: true })
    pdf.moveDown()

    if (!items || items.length === 0) {
      pdf.fontSize(12).text("Geen data beschikbaar.")
      pdf.moveDown()
      return
    }

    items.forEach(item => {
      pdf.fontSize(12).text(JSON.stringify(item, null, 2))
      pdf.moveDown()
    })
  }

  section("Architect Varianten", architect)
  section("Calculaties", calculaties)
  section("Installatietechniek", installaties)
  section("Planning", planning)
  section("Offertes", offertes)
  section("Juridische documenten", juridische_docs)
  section("Uitvoering", uitvoering)
  section("Urenregistratie", uren)
  section("Inkoop", inkoop)
  section("Kosten", kosten)
  section("Inkomsten", inkomsten)

  pdf.end()

  await new Promise(resolve => pdfStream.on("finish", resolve))

  /* -----------------------------------------------------------
     3. ZIP EXPORT GENEREREN
  ----------------------------------------------------------- */

  const zipPath = `/tmp/${project_id}-export.zip`
  const output = fs.createWriteStream(zipPath)
  const archive = archiver("zip", { zlib: { level: 9 } })

  archive.pipe(output)

  archive.file(pdfPath, { name: "ProjectBundel.pdf" })

  function addFiles(items, folder) {
    items.forEach(i => {
      if (!i.json_url) return
      archive.append(JSON.stringify(i, null, 2), {
        name: `${folder}/${i.id}.json`
      })
    })
  }

  addFiles(architect, "architect")
  addFiles(calculaties, "calculaties")
  addFiles(installaties, "installatie")
  addFiles(planning, "planning")
  addFiles(offertes, "offertes")
  addFiles(juridische_docs, "juridisch")
  addFiles(uitvoering, "uitvoering")
  addFiles(uren, "uren")
  addFiles(inkoop, "inkoop")
  addFiles(kosten, "kosten")
  addFiles(inkomsten, "inkomsten")

  await archive.finalize()

  await new Promise(resolve => output.on("close", resolve))

  /* -----------------------------------------------------------
     4. ZIP UPLOADEN NAAR SUPABASE STORAGE
  ----------------------------------------------------------- */

  const binary = fs.readFileSync(zipPath)

  const uploadPath = `exports/${project_id}/${Date.now()}.zip`

  await supabase.storage
    .from("documents")
    .upload(uploadPath, binary, {
      contentType: "application/zip",
      upsert: false
    })

  const { data: urlData } = supabase.storage
    .from("documents")
    .getPublicUrl(uploadPath)

  res.json({
    exported: true,
    zip_url: urlData.publicUrl
  })
})

export default router
