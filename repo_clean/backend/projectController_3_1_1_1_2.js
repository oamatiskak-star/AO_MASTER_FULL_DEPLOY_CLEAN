import dotenv from "dotenv"
dotenv.config()

import fetch from "node-fetch"

export async function createProject(req, res) {
try {
const { name, description } = req.body

if (!name) {
  return res.status(400).json({ ok: false, msg: "Naam ontbreekt" })
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const response = await fetch(`${supabaseUrl}/rest/v1/projects`, {
  method: "POST",
  headers: {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name,
    description,
    created_at: new Date().toISOString()
  })
})

const data = await response.json()

return res.json({ ok: true, data })


} catch (err) {
return res.status(500).json({ ok: false, msg: "Serverfout", error: err.message })
}
}

export async function listProjects(req, res) {
try {
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const response = await fetch(`${supabaseUrl}/rest/v1/projects?select=*`, {
  headers: {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`
  }
})

const data = await response.json()

return res.json({ ok: true, data })


} catch (err) {
return res.status(500).json({ ok: false, msg: "Serverfout", error: err.message })
}
}