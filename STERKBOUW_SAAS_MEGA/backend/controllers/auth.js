
import { supabase } from "../lib/supabase.js"

export async function login(req,res){
  const { email, password } = req.body
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if(error) return res.status(400).json({ error: error.message })
  res.json({ user:data.user })
}
