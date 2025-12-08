import { supabase } from "./config.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { userId, role } = req.body

  const { data, error } = await supabase
    .from("user_roles")
    .insert([{ user_id: userId, role }])

  if (error) return res.status(400).json({ error: error.message })

  return res.status(200).json({ role: data })
}
