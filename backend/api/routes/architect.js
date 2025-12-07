import express from "express";
const router = express.Router();

router.post("/design", (req, res) => {
res.json({ design: "created" });
});

export default router;