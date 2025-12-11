import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/", (req, res) => {
const processedDir = path.join(process.cwd(), "backend/modules_processed");
const files = fs.existsSync(processedDir)
? fs.readdirSync(processedDir)
: [];

res.json({
status: "online",
modules_processed: files.length,
modules: files
});
});

export default router;