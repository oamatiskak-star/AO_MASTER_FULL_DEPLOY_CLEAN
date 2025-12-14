
import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Login() {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  async function handleLogin(e){
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if(error){ setError(error.message); return }
    window.location.href="/dashboard"
  }

  return (
    <div style={{padding:40}}>
      <h1>SterkBouw Login</h1>
      <form onSubmit={handleLogin}>
        <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button type="submit">Login</button>
        {error && <p style={{color:"red"}}>{error}</p>}
      </form>
    </div>
  )
}
