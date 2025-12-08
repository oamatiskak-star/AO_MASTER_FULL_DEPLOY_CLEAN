import { supabase } from "./config.js"

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("projects")
      .select("*")

    if (error) return res.status(400).json({ error: error.message })

    return res.status(200).json({ projects: data })
  }

  if (req.method === "POST") {
    const { name, locatie, status } = req.body
    const { data, error } = await supabase
      .from("projects")
      .insert([{ name, locatie, status }])

    if (error) return res.status(400).json({ error: error.message })

    return res.status(200).json({ project: data })
  }

  return res.status(405).json({ error: "Method not allowed" })
}
