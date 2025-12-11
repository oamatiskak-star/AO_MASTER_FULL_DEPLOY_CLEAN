import jwt from "jsonwebtoken"
import { supabase } from "./config.js"

export default async function handler(req, res) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: "No token" })

  const token = auth.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", decoded.id)
      .single()

    if (error) return res.status(400).json({ error: error.message })

    return res.status(200).json({ user: decoded, role: data })
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}


