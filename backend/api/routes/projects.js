import express from "express"
import { createProject, listProjects } from "../controllers/projectsController.js"

const router = express.Router()

router.post("/create", createProject)
router.get("/list", listProjects)

export default router