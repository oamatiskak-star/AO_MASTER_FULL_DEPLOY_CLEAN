import { supabase } from "./config"

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization || ""
    const token = authHeader.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ error: "Geen token aanwezig" })
    }

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: "Token ongeldig" })
    }

    return res.status(200).json({ user: data.user })
  } catch (err) {
    return res.status(500).json({ error: "Server error" })
  }
}


