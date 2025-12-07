import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
res.json({ planning: "created" });
});

export default router;