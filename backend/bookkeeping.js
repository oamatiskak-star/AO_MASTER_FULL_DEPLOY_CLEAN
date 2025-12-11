import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
res.json({ bookkeeping: "connected" });
});

export default router;