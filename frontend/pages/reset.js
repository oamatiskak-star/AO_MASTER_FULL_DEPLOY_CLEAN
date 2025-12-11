import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON
)

export default function Reset() {
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState("")

  async function reset(e) {
    e.preventDefault()

    await supabase.auth.resetPasswordForEmail(email)
    setMsg("Reset link verstuurd.")
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Wachtwoord resetten</h1>
      <form onSubmit={reset}>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <button type="submit">Verstuur reset</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
