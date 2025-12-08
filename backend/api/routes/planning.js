<?php /* FILE: backend/api/routes/planning.js — VOLLEDIG BESTAND */ ?>

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
   GET — planning + tasks + fasen
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query
  if (!project_id) return res.status(400).json({ error: "project_id ontbreekt" })

  const { data: fases } = await supabase
    .from("planning_fases")
    .select("*")
    .eq("project_id", project_id)
    .order("volgorde", { ascending: true })

  const { data: taken } = await supabase
    .from("planning_taken")
    .select("*")
    .eq("project_id", project_id)
    .order("startdatum", { ascending: true })

  res.json({ fases, taken })
})

/* -----------------------------------------------------------
   POST — fase toevoegen
----------------------------------------------------------- */
router.post("/fase", async (req, res) => {
  const { project_id, naam, volgorde } = req.body

  const { data, error } = await supabase
    .from("planning_fases")
    .insert([{ project_id, naam, volgorde }])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ created: true, fase: data[0] })
})

/* -----------------------------------------------------------
   POST — taak toevoegen
----------------------------------------------------------- */
router.post("/taak", async (req, res) => {
  const {
    project_id,
    fase_id,
    taaknaam,
    startdatum,
    einddatum,
    voortgang
  } = req.body

  const payload = {
    project_id,
    fase_id,
    taaknaam,
    startdatum,
    einddatum,
    voortgang: Number(voortgang || 0)
  }

  const { data, error } = await supabase
    .from("planning_taken")
    .insert([payload])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ created: true, taak: data[0] })
})

/* -----------------------------------------------------------
   PUT — taak voortgang aanpassen
----------------------------------------------------------- */
router.put("/taak/:id", async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const { data, error } = await supabase
    .from("planning_taken")
    .update(updates)
    .eq("id", id)
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ updated: true, taak: data[0] })
})

/* -----------------------------------------------------------
   DELETE — fase of taak verwijderen
----------------------------------------------------------- */
router.delete("/taak/:id", async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("planning_taken")
    .delete()
    .eq("id", id)

  if (error) return res.status(500).json({ error: error.message })

  res.json({ deleted: true })
})

router.delete("/fase/:id", async (req, res) => {
  const { id } = req.params

  // eerst taken verwijderen die bij deze fase horen
  await supabase.from("planning_taken").delete().eq("fase_id", id)

  const { error } = await supabase
    .from("planning_fases")
    .delete()
    .eq("id", id)

  if (error) return res.status(500).json({ error: error.message })

  res.json({ deleted: true })
})

export default router
