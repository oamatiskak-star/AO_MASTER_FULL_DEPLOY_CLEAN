module.exports = {
  upload: (req, res) => {
    if (!req.file) return res.json({ ok: false, error: "Geen bestand ontvangen" })
    res.json({
      ok: true,
      filename: req.file.originalname,
      stored: req.file.path
    })
  }
}
