import { supabase } from "./config"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    return res.status(401).json({ error: "Onjuiste inloggegevens" })
  }

  return res.status(200).json({
    token: data.session.access_token
  })
}
