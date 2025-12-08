import { supabase } from "./config.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { dossierId } = req.body

    const { data, error } = await supabase
      .from("juridisch_dossiers")
      .select("*")
      .eq("id", dossierId)
      .single()

    if (error) return res.status(400).json({ error: error.message })

    return res.status(200).json({ dossier: data })
  } catch {
    return res.status(500).json({ error: "Server error" })
  }
}
