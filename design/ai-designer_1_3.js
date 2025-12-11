import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
res.json({ design: "ai-designer ready" });
});

export default router;