import jwt from "jsonwebtoken"

export default function auth(requiredRole = null) {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization
      if (!header) return res.status(401).json({ error: "No token" })

      const token = header.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = decoded

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden" })
      }

      next()
    } catch (e) {
      return res.status(401).json({ error: "Invalid token" })
    }
  }
}
