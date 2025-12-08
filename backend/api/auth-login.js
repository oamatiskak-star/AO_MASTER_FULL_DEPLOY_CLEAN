import { supabase } from "./config.js"
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { email, password } = req.body

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) return res.status(400).json({ error: error.message })

  const token = jwt.sign(
    {
      id: data.user.id,
      email: data.user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  res.status(200).json({ token, user: data.user })
}
