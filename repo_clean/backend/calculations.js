import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function ok(data) {
  return { success: true, data };
}

function fail(msg) {
  return { success: false, error: msg };
}

// ALLE CALCULATIES PER PROJECT
router.get("/:project_id", async (req, res) => {
  const { project_id } = req.params;

  const { data, error } = await supabase
    .from("calculations")
    .select("*")
    .eq("project_id", project_id);

  if (error) return res.status(500).json(fail(error.message));

  return res.json(ok(data));ja

});

// 1 REGEL TOEVOEGEN
router.post("/", async (req, res) => {
  const body = req.body;

  const { data, error } = await supabase
    .from("calculations")
    .insert(body)
    .select("*")
    .single();

  if (error) return res.status(500).json(fail(error.message));

  return res.json(ok(data));
});

export default router;
