"use client";

import { useEffect, useState } from "react";
import { supabase } from "../api/config";
import Link from "next/link";

export default function Dashboard() {
const [session, setSession] = useState(null);
const [projects, setProjects] = useState([]);

useEffect(() => {
async function load() {
const s = await supabase.auth.getSession();
if (!s?.data?.session) {
window.location.href = "/login";
return;
}
setSession(s.data.session);

  const res = await fetch("/api/projects");
  const json = await res.json();
  setProjects(json);
}
load();


}, []);

return (
<div style={{ padding: 40 }}>
<h1 style={{ fontSize: 40, color: "#F0A500" }}>Welkom {session?.user?.email}</h1>

  <h2 style={{ marginTop: 40 }}>Projecten</h2>
  <ul>
    {projects.map((p) => (
      <li key={p.id}>
        <Link href={`/project/${p.id}`}>{p.name}</Link>
      </li>
    ))}
  </ul>

  <h2 style={{ marginTop: 50 }}>Modules</h2>
  <ul>
    <li><a href="/modules/calc">Calculatie</a></li>
    <li><a href="/modules/architect">Architect</a></li>
    <li><a href="/modules/installatie">Installatie</a></li>
    <li><a href="/modules/juridisch">Juridisch</a></li>
    <li><a href="/modules/documenten">Documenten</a></li>
    <li><a href="/modules/uren">Uren</a></li>
    <li><a href="/modules/inkoop">Inkoop</a></li>
    <li><a href="/modules/uitvoering">Uitvoering</a></li>
    <li><a href="/modules/viewer">Viewer</a></li>
  </ul>
</div>


);
}