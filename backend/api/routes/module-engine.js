import express from "express";
import fs from "fs-extra";
import path from "path";

const router = express.Router();

// map fix
const MODULE_DIR = path.resolve("backend/modules_incoming");

// zorg dat pad ALTIJD bestaat
await fs.ensureDir(MODULE_DIR);

router.get("/", (req, res) => {
  res.json({ status: "module-engine ok" });
});

export default router;
