<?php /* FILE: backend/api/routes/notifications.js — VOLLEDIG BESTAND */ ?>

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
   GET — alle notificaties voor project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  if (!project_id) {
    return res.status(400).json({ error: "project_id ontbreekt" })
  }

  const { data, error } = await supabase
    .from("notificaties")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ notificaties: data })
})

/* -----------------------------------------------------------
   POST — nieuwe notificatie toevoegen
----------------------------------------------------------- */
router.post("/", async (req, res) => {
  const { project_id, titel, bericht, type } = req.body

  if (!project_id || !titel || !bericht) {
    return res.status(400).json({ error: "ontbrekende velden" })
  }

  const payload = {
    project_id,
    titel,
    bericht,
    type
  }

  const { data, error } = await supabase
    .from("notificaties")
    .insert([payload])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ created: true, notificatie: data[0] })
})

/* -----------------------------------------------------------
   PUT — notificatie bijwerken
----------------------------------------------------------- */
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const updates = req.body

  const { data, error } = await supabase
    .from("notificaties")
    .update(updates)
    .eq("id", id)
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ updated: true, notificatie: data[0] })
})

/* -----------------------------------------------------------
   DELETE — notificatie verwijderen
----------------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("notificaties")
    .delete()
    .eq("id", id)

  if (error) return res.status(500).json({ error: error.message })

  res.json({ deleted: true })
})

export default router
