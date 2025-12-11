module.exports = {
  run: (req, res) => {
    const input = req.body || {}
    res.json({ ok: true, result: "calc executed", input })
  }
}
