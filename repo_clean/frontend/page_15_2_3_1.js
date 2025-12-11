"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../api/config";
import Link from "next/link";

export default function ProjectDetail() {
const { id } = useParams();
const [session, setSession] = useState(null);
const [project, setProject] = useState(null);

useEffect(() => {
async function load() {
const s = await supabase.auth.getSession();
if (!s?.data?.session) {
window.location.href = "/login";
return;
}
setSession(s.data.session);

  const res = await fetch("/api/projects?id=" + id);
  const json = await res.json();
  setProject(json);
}
load();


}, [id]);

if (!project) return <div style={{ padding: 40 }}>Laden...</div>;

return (
<div style={{ padding: 40 }}>
<h1 style={{ fontSize: 40, color: "#F0A500" }}>{project.name}</h1>
<p>{project.description}</p>

  <h2 style={{ marginTop: 40 }}>Modules</h2>

  <ul>
    <li><Link href={`/modules/calc?project=${id}`}>Calculatie</Link></li>
    <li><Link href={`/modules/architect?project=${id}`}>Architect</Link></li>
    <li><Link href={`/modules/installatie?project=${id}`}>Installatie</Link></li>
    <li><Link href={`/modules/juridisch?project=${id}`}>Juridisch</Link></li>
    <li><Link href={`/modules/documenten?project=${id}`}>Documenten</Link></li>
    <li><Link href={`/modules/uren?project=${id}`}>Uren</Link></li>
    <li><Link href={`/modules/inkoop?project=${id}`}>Inkoop</Link></li>
    <li><Link href={`/modules/uitvoering?project=${id}`}>Uitvoering</Link></li>
    <li><Link href={`/modules/viewer?project=${id}`}>Viewer</Link></li>
  </ul>
</div>


);
}