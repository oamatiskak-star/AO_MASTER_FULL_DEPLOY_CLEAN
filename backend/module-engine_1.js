import express from "express";
import { handleModuleUpload, listModules } from "../services/moduleEngine.js";

const router = express.Router();

// Upload module ZIP
router.post("/", handleModuleUpload);

// Lijst van beschikbare modules
router.get("/", listModules);

export default router;
