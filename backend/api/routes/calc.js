import express from "express"
import { supabase } from "../supabaseClient.js"

const router = express.Router()

router.get("/lines/:version_id", async (req,res) => {
const { version_id } = req.params
const { data, error } = await supabase
.from("calc_lines")
.select("*")
.eq("version_id", version_id)
if (error) return res.status(400).json(error)
res.json(data)
})

router.post("/line", async (req,res) => {
const body = req.body
const { data, error } = await supabase
.from("calc_lines")
.insert(body)
.select()
if (error) return res.status(400).json(error)
res.json(data)
})

export default router
