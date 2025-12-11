import express from "express";
const router = express.Router();

router.post("/generate", (req, res) => {
res.json({ drawing: "ready" });
});

export default router;