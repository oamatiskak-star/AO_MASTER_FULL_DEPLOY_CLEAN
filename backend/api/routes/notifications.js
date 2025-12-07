import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
res.json({ notification: "sent" });
});

export default router;