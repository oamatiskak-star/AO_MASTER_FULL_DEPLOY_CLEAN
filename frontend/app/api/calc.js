import { supabase } from "./config.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { moduleId } = req.body

    const { data, error } = await supabase
      .from("calculaties")
      .select("*")
      .eq("module_id", moduleId)
      .single()

    if (error) return res.status(400).json({ error: error.message })

    return res.status(200).json({ calculatie: data })
  } catch {
    return res.status(500).json({ error: "Server error" })
  }
}
