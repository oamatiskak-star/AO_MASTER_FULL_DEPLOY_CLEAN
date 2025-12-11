import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs-extra";

const router = express.Router();

const uploadDir = path.resolve("backend/uploads");
await fs.ensureDir(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  res.json({ status: "ok", file: req.file });
});

export default router;
