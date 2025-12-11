
import express from "express"
import { calculate } from "../controllers/calculations.js"
const router = express.Router()

router.post("/", calculate)

export default router
