<?php /* FILE: backend/api/routes/inkoop.js — VOLLEDIG BESTAND */ ?>

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
   POST — Nieuwe inkooporder aanmaken
----------------------------------------------------------- */
router.post("/add", async (req, res) => {
  const { project_id, leverancier, omschrijving, hoeveelheid, prijs, status } =
    req.body

  if (!project_id || !leverancier || !omschrijving) {
    return res.status(400).json({ error: "verplichte velden ontbreken" })
  }

  const { data, error } = await supabase
    .from("inkooporders")
    .insert([
      {
        project_id,
        leverancier,
        omschrijving,
        hoeveelheid,
        prijs,
        status: status || "Aangevraagd"
      }
    ])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ saved: true, order: data[0] })
})

/* -----------------------------------------------------------
   GET — Alle inkooporders van een project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query

  const { data, error } = await supabase
    .from("inkooporders")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ orders: data })
})

/* -----------------------------------------------------------
   PATCH — Status wijzigen
----------------------------------------------------------- */
router.patch("/status", async (req, res) => {
  const { id, status } = req.body

  const { data, error } = await supabase
    .from("inkooporders")
    .update({ status })
    .eq("id", id)
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ updated: true, order: data[0] })
})

export default router
