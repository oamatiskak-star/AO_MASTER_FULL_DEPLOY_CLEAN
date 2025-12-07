import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
res.json({ execute: "ok" });
});

export default router;