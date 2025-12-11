import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
)

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function doLogin(e) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return setError(error.message)

    window.location.href = "/dashboard"
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>
      <form onSubmit={doLogin}>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Wachtwoord" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Inloggen</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <a href="/reset">Wachtwoord vergeten?</a>
    </div>
  )
}
