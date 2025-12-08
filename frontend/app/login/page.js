"use client";

import { useState, useEffect } from "react";
import { supabase } from "../api/config";

export default function Login() {
const [email, setEmail] = useState("o.amatiskak@sterkbouw.nl
");
const [password, setPassword] = useState("");

useEffect(() => {
async function check() {
const s = await supabase.auth.getSession();
if (s?.data?.session) {
window.location.href = "/dashboard";
}
}
check();
}, []);

async function login(e) {
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
  alert("Onjuist wachtwoord of fout.");
}


}

return (
<div style={{ padding: 40 }}>
<h1 style={{ fontSize: 40, color: "#F0A500" }}>Inloggen</h1>

  <form onSubmit={login}>
    <label>Email</label>
    <input value={email} readOnly />

    <label>Wachtwoord</label>
    <input type="password" onChange={(e) => setPassword(e.target.value)} />

    <button type="submit">Inloggen</button>
  </form>
</div>


);
}