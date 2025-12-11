import express from "express"
import fs from "fs"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const path = "/opt/render/project/src/test_write_success.txt"
    fs.writeFileSync(path, "AO autobuilder OK")
    res.json({ ok: true, written: path })
  } catch (err) {
    res.json({ ok: false, error: err.message })
  }
})

export default router
