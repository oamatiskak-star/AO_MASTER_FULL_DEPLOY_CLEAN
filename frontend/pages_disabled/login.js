import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth-login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    localStorage.setItem("sb_token", data.token)
    window.location.href = "/dashboard"
  }

  return (
    <main style={{
      maxWidth: 400,
      margin: "80px auto",
      padding: 20,
      background: "#111",
      border: "1px solid #222",
      borderRadius: 8
    }}>
      <h1 style={{ color: "#F4B000", marginBottom: 20 }}>Inloggen</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: "white" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #333",
              marginTop: 6
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ color: "white" }}>Wachtwoord</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #333",
              marginTop: 6
            }}
          />
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: 12 }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#F4B000",
            color: "#000",
            padding: "12px 18px",
            borderRadius: 8,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            marginTop: 10
          }}
        >
          {loading ? "Bezig..." : "Inloggen"}
        </button>
      </form>
    </main>
  )
}
