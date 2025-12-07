import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
res.json({ blueprint: "generated" });
});

export default router;