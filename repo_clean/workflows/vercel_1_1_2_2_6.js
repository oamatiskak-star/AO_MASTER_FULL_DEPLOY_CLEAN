import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
res.json({ vercel: "connected" });
});

export default router;