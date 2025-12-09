"use client";

import { useState } from "react";

export default function Login() {
  const [email] = useState("o.amatiskak@sterkbouw.nl");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    const res = await fetch("/api/auth-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const json = await res.json();

    if (json?.token) {
      window.location.href = "/dashboard";
    } else {
      alert(json.error || "Login fout");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Inloggen</h1>
      <form onSubmit={submit}>
        <input value={email} readOnly />
        <input
          type="password"
          placeholder="Wachtwoord"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
