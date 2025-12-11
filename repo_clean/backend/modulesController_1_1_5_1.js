module.exports = {
  list: (req, res) => {
    res.json({ ok: true, modules: [] })
  },
  create: (req, res) => {
    res.json({ ok: true, created: req.body })
  }
}
