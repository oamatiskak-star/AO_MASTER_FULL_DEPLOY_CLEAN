import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
res.json({ ok: true, calc: "module online" });
});

export default router;