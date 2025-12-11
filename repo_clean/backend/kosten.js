<?php /* FILE: backend/api/routes/kosten.js — VOLLEDIG BESTAND */ ?>

import express from "express"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import multer from "multer"
import fs from "fs"

dotenv.config()

const router = express.Router()
const upload = multer({ dest: "/tmp" })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   GET — alle kosten + facturen bij project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  if (!project_id) {
    return res.status(400).json({ error: "project_id ontbreekt" })
  }

  const { data, error } = await supabase
    .from("kosten")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ kosten: data })
})

/* -----------------------------------------------------------
   POST — nieuwe kostenregel + optionele factuur upload
----------------------------------------------------------- */
router.post("/", upload.single("file"), async (req, res) => {
  const {
    project_id,
    leverancier,
    omschrijving,
    categorie,
    bedrag_excl,
    btw_percentage,
    datum
  } = req.body

  if (!project_id || !omschrijving) {
    return res.status(400).json({ error: "verplichte velden ontbreken" })
  }

  let file_url = null

  if (req.file) {
    const filepath = `facturen/${project_id}/${req.file.originalname}`
    const fileContent = fs.readFileSync(req.file.path)

    const { error: uploadError } = await supabase.storage
      .from("sterkbouw")
      .upload(filepath, fileContent, { upsert: true })

    fs.unlinkSync(req.file.path)

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message })
    }

    file_url = supabase.storage
      .from("sterkbouw")
      .getPublicUrl(filepath).data.publicUrl
  }

  const bedrag = Number(bedrag_excl || 0)
  const btw = (Number(btw_percentage || 0) / 100) * bedrag
  const totaal = bedrag + btw

  const payload = {
    project_id,
    leverancier,
    omschrijving,
    categorie,
    bedrag_excl: bedrag,
    btw_percentage,
    bedrag_btw: btw,
    bedrag_totaal: totaal,
    datum,
    factuur_url: file_url
  }

  const { data, error } = await supabase
    .from("kosten")
    .insert([payload])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ created: true, kosten: data[0] })
})

/* -----------------------------------------------------------
   PUT — kostenregel bijwerken
----------------------------------------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const { data, error } = await supabase
    .from("kosten")
    .update(updates)
    .eq("id", id)
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ updated: true, kosten: data[0] })
})

/* -----------------------------------------------------------
   DELETE — kostenregel verwijderen
----------------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("kosten")
    .delete()
    .eq("id", id)

  if (error) return res.status(500).json({ error: error.message })

  res.json({ deleted: true })
})

export default router
