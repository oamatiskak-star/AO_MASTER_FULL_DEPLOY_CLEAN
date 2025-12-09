import express from "express";
import { executorHealth, executorStatus, sendTaskToExecutor } from "../executor-client.js";

const router = express.Router();

// HEALTH
router.get("/health", async (req, res) => {
  try {
    const result = await executorHealth();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// STATUS
router.get("/status", async (req, res) => {
  try {
    const result = await executorStatus();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// EXECUTE
router.post("/execute", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Geen taak opgegeven" });
  }

  try {
    const result = await sendTaskToExecutor(task);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

export default router;
