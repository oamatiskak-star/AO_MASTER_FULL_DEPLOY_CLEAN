<?php /* FILE: backend/api/routes/uitvoering.js — VOLLEDIG BESTAND */ ?>

import express from "express"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   POST — Dagrapport aanmaken
----------------------------------------------------------- */
router.post("/dagrapport", async (req, res) => {
  const { project_id, datum, werkzaamheden, meerwerk, materialen } = req.body

  if (!project_id || !datum) {
    return res.status(400).json({ error: "project_id en datum verplicht" })
  }

  const { data, error } = await supabase
    .from("dagrapporten")
    .insert([
      {
        project_id,
        datum,
        werkzaamheden,
        meerwerk,
        materialen
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ saved: true, rapport: data[0] })
})

/* -----------------------------------------------------------
   POST — Upload foto
----------------------------------------------------------- */
router.post("/foto", async (req, res) => {
  try {
    const { project_id, filename } = req.body
    const file = req.files?.file

    if (!file) return res.status(400).json({ error: "Geen bestand ontvangen" })

    const path = `uitvoering/${project_id}/${Date.now()}_${filename}`

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, file.data, {
        contentType: file.mimetype,
        upsert: false
      })

    if (uploadError) return res.status(500).json({ error: uploadError.message })

    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(path)

    // opslaan in tabel
    const { data, error } = await supabase
      .from("uitvoering_fotos")
      .insert([
        {
          project_id,
          url: urlData.publicUrl
        }
      ])
      .select("*")

    if (error) return res.status(500).json({ error: error.message })

    res.json({ uploaded: true, foto: data[0] })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* -----------------------------------------------------------
   GET — Dagrapporten ophalen
----------------------------------------------------------- */
router.get("/dagrapporten", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("dagrapporten")
    .select("*")
    .eq("project_id", project_id)
    .order("datum", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ rapporten: data })
})

/* ------------------------*
