import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();
const upload = multer({ dest: path.join(process.cwd(), "backend/tmp_uploads") });

router.post("/", upload.single("file"), (req, res) => {
if (!req.file) return res.status(400).json({ error: "geen bestand" });
res.json({ uploaded: true, file: req.file.originalname });
});

export default router;