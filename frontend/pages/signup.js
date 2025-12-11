import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
)

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function register(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) return setError(error.message)

    alert("Account aangemaakt. Check je mail.")
    window.location.href = "/login"
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Account aanmaken</h1>
      <form onSubmit={register}>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Wachtwoord" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Registreren</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}
