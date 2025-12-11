module.exports = {
  analyse: (req, res) => {
    const input = req.body || {}
    res.json({ ok: true, analysis: "juridisch analyse uitgevoerd", input })
  }
}
