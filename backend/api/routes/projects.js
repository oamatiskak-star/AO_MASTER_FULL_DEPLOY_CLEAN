import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Verbinding Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET: alle projecten
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json({ projects: data });
});

// POST: nieuw project aanmaken
router.post("/", async (req, res) => {
  const { projectnaam, adres } = req.body;

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        projectnaam,
        adres
      }
    ])
    .select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json({ created: true, project: data[0] });
});

export default router;
