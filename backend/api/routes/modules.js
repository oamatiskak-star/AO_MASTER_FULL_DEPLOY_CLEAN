import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const PROCESSED = path.join(process.cwd(), "backend/modules_processed");

router.get("/", (req, res) => {
const files = fs.readdirSync(PROCESSED).filter(f => f.endsWith(".zip"));
res.json({ modules: files });
});

export default router;