<?php /* FILE: backend/api/routes/inkomsten.js — VOLLEDIG BESTAND */ ?>

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
   GET — alle huurinkomsten per project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  if (!project_id) {
    return res.status(400).json({ error: "project_id ontbreekt" })
  }

  const { data, error } = await supabase
    .from("inkomsten")
    .select("*")
    .eq("project_id", project_id)
    .order("datum", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ inkomsten: data })
})

/* -----------------------------------------------------------
   POST — huurcontract / maandbetaling toevoegen
----------------------------------------------------------- */
router.post("/", async (req, res) => {
  const {
    project_id,
    huurder,
    bedrag,
    datum,
    maand,
    jaar,
    status
  } = req.body

  if (!project_id || !bedrag || !datum) {
    return res.status(400).json({ error: "verplichte velden missen" })
  }

  const payload = {
    project_id,
    huurder,
    bedrag: Number(bedrag),
    datum,
    maand,
    jaar,
    status
  }

  const { data, error } = await supabase
    .from("inkomsten")
    .insert([payload])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ created: true, item: data[0] })
})

/* -----------------------------------------------------------
   PUT — inkomsten updaten
----------------------------------------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const { data, error } = await supabase
    .from("inkomsten")
    .update(updates)
    .eq("id", id)
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ updated: true, item: data[0] })
})

/* -----------------------------------------------------------
   DELETE — inkomstenregel verwijderen
----------------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("inkomsten")
    .delete()
    .eq("id", id)

  if (error) return res.status(500).json({ error: error.message })

  res.json({ deleted: true })
})

export default router
