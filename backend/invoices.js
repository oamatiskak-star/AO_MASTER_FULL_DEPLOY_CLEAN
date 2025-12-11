import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
res.json({ invoice: "created" });
});

export default router;