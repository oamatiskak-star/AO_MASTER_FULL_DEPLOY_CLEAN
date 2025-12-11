module.exports = {
  getAll: (req, res) => {
    res.json({ ok: true, projects: [] })
  },
  create: (req, res) => {
    res.json({ ok: true, created: req.body || {} })
  }
}
