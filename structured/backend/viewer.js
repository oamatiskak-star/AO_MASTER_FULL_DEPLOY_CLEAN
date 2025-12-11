<?php /* FILE: backend/api/routes/viewer.js — VOLLEDIG BESTAND */ ?>

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
   GET — alle documenten bij project
----------------------------------------------------------- */
router.get("/", async (req, res) => {
  const { project_id } = req.query
  if (!project_id) return res.status(400).json({ error: "project_id ontbreekt" })

  const { data, error } = await supabase
    .from("documenten")
    .select("*")
    .eq("project_id", project_id)
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  res.json({ documenten: data })
})

export default router
