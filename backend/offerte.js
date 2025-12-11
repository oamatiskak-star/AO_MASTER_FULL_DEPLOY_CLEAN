<?php /* FILE: backend/api/routes/offerte.js — VOLLEDIG BESTAND */ ?>

import express from "express"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import PDFDocument from "pdfkit"
import { Readable } from "stream"

dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   POST — Maak offerte (PDF + opslag in database)
----------------------------------------------------------- */
router.post("/create", async (req, res) => {
  const {
    project_id,
    opdrachtgever,
    adres,
    beschrijving,
    calculatie // JSON totaal vanuit AI engine
  } = req.body

  if (!project_id || !calculatie) {
    return res.status(400).json({ error: "project_id en calculatie verplicht" })
  }

  // PDF genereren
  const pdfBuffer = await createOffertePDF({
    project_id,
    opdrachtgever,
    adres,
    beschrijving,
    calculatie
  })

  // Upload naar Supabase Storage
  const filename = `offertes/${project_id}_${Date.now()}.pdf`

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filename, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false
    })

  if (uploadError) return res.status(500).json({ error: uploadError.message })

  const { data: urlData } = supabase.storage
    .from("documents")
    .getPublicUrl(filename)

  // In database opslaan
  const { data, error } = await supabase
    .from("offertes")
    .insert([
      {
        project_id,
        opdrachtgever,
        adres,
        beschrijving,
        totaal: calculatie.totaal.totaal,
        url: urlData.publicUrl
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({
    created: true,
    offerte: data[0]
  })
})

/* -----------------------------------------------------------
   GET — Alle offertes voor project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("offertes")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ offertes: data })
})

/* -----------------------------------------------------------
   PDF generator (2jours-stijl)
----------------------------------------------------------- */
async function createOffertePDF({ opdrachtgever, adres, beschrijving, calculatie }) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 })

    const stream = doc.pipe(new Readable().wrap())

    let buffers = []

    stream.on("data", buffers.push.bind(buffers))
    stream.on("end", () => resolve(Buffer.concat(buffers)))

    // Voorblad
    doc.fontSize(26).text("OFFERTE", { align: "center" })
    doc.moveDown()

    doc.fontSize(12).text(`Opdrachtgever: ${opdrachtgever}`)
    doc.text(`Adres: ${adres}`)
    doc.moveDown()
    doc.text(`Omschrijving: ${beschrijving}`)
    doc.moveDown(2)

    doc.fontSize(16).text("Samenvatting kosten")
    doc.moveDown()

    doc.fontSize(12)
    doc.text(`Materialen: € ${calculatie.totaal.materialen.toFixed(2)}`)
    doc.text(`Arbeid: € ${calculatie.totaal.arbeid.toFixed(2)}`)
    doc.text(`Subtotaal: € ${calculatie.totaal.subtotal.toFixed(2)}`)
    doc.text(`Opslag: € ${calculatie.totaal.opslag.toFixed(2)}`)
    doc.text(`AK: € ${calculatie.totaal.ak.toFixed(2)}`)
    doc.text(`ABK: € ${calculatie.totaal.abk.toFixed(2)}`)
    doc.text(`Winst: € ${calculatie.totaal.winst.toFixed(2)}`)
    doc.text(`Risico: € ${calculatie.totaal.risico.toFixed(2)}`)
    doc.moveDown()

    doc.fontSize(16).text(`Totaal: € ${calculatie.totaal.totaal.toFixed(2)}`, {
      underline: true
    })

    doc.end()
  })
}

export default router
