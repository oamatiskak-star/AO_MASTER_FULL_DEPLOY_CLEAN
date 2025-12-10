import express from "express"
import multer from "multer"
import fs from "fs"
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
dotenv.config()

const router = express.Router()
const upload = multer({ dest: "/tmp" })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/* -----------------------------------------------------------
   POST — document uploaden
----------------------------------------------------------- */
router.post("/", upload.single("file"), async (req, res) => {
  const { project_id, categorie } = req.body

  if (!project_id) {
    return res.status(400).json({ error: "project_id ontbreekt" })
  }

  if (!req.file) {
    return res.status(400).json({ error: "bestand ontbreekt" })
  }

  const filename = `${Date.now()}-${req.file.originalname}`
  const path = `documenten/${project_id}/${filename}`
  const fileData = fs.readFileSync(req.file.path)

  const { error: uploadError } = await supabase.storage
    .from("sterkbouw")
    .upload(path, fileData, { upsert: true })

  fs.unlinkSync(req.file.path)

  if (uploadError) {
    return res.status(500).json({ error: uploadError.message })
  }

  const publicUrl = supabase.storage
    .from("sterkbouw")
    .getPublicUrl(path).data.publicUrl

  const payload = {
    project_id,
    categorie,
    bestandsnaam: filename,
    url: publicUrl
  }

  const { data, error } = await supabase
    .from("documenten")
    .insert([payload])
    .select("*")

  if (error) return res.status(500).json({ error: error.message })

  res.json({ uploaded: true, document: data[0] })
})

export default router
