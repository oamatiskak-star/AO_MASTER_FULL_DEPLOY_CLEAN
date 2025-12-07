import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

const router = express.Router();

const INCOMING = path.join(process.cwd(), "backend/modules_incoming");
const PROCESSED = path.join(process.cwd(), "backend/modules_processed");
const INDEX_FILE = path.join(PROCESSED, "module_index.json");

if (!fs.existsSync(INCOMING)) fs.mkdirSync(INCOMING);
if (!fs.existsSync(PROCESSED)) fs.mkdirSync(PROCESSED);

const upload = multer({ dest: INCOMING });

router.post("/", upload.single("file"), (req, res) => {
try {
if (!req.file) return res.status(400).json({ error: "geen bestand" });

const newName = req.file.originalname;
const finalIncoming = path.join(INCOMING, newName);
fs.renameSync(req.file.path, finalIncoming);

const finalProcessed = path.join(PROCESSED, newName);
fs.copyFileSync(finalIncoming, finalProcessed);

let index = [];
if (fs.existsSync(INDEX_FILE)) {
  index = JSON.parse(fs.readFileSync(INDEX_FILE));
}

index.push(newName);
fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));

res.json({
  uploaded: true,
  incoming: newName,
  processed: newName
});


} catch (err) {
res.status(500).json({ error: err.message });
}
});

router.get("/", (req, res) => {
if (!fs.existsSync(INDEX_FILE)) return res.json({ modules: [] });

const list = JSON.parse(fs.readFileSync(INDEX_FILE));
res.json({ modules: list });
});

export default router;