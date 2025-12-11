import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
res.json({ workers: ["Lars", "Sven", "Eva"] });
});

export default router;