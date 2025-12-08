import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Supabase verbinding
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY   // BELANGRIJK → SERVICE KEY
);

// GET: alle projecten
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Supabase fout:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ projects: data || [] });
});

// POST: nieuw project
router.post("/", async (req, res) => {
  const { projectnaam, adres } = req.body;

  if (!projectnaam || !adres) {
    return res.status(400).json({
      error: "projectnaam en adres zijn verplicht"
    });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([{ projectnaam, adres }])
    .select("*")
    .single();

  if (error) {
    console.error("Supabase fout (create project):", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({
    created: true,
    project: data
  });
});

export default router;
