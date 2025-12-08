<?php /* FILE: frontend/pages/projects/[id]/juridisch.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function JuridischPage() {
  const router = useRouter()
  const { id } = router.query

  const [type, setType] = useState("")
  const [data, setData] = useState("")
  const [docs, setDocs] = useState([])

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/juridisch?project_id=${id}`
    )
    const json = await res.json()
    setDocs(json.documenten || [])
  }

  async function generate() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/juridisch/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          type,
          data: JSON.parse(data || "{}")
        })
      }
    )

    setType("")
    setData("")

    load()
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        
        <h1>Juridische Module (Ali)</h1>

        <div style={{ display: "grid", gap: 10, width: 400 }}>
          <input placeholder="Document type" value={type} onChange={e => setType(e.target.value)} />
          <textarea placeholder="JSON data, bv { \"naam\": \"klant\" }"
            value={data}
            onChange={e => setData(e.target.value)}
            rows={6}
          />
          <button
            onClick={generate}
            style={{
              background: "#FFD400",
              padding: 12,
              border: "none",
              fontWeight: "bold"
            }}
          >
            Document genereren
          </button>
        </div>

        <h2 style={{ marginTop: 40 }}>Documenten</h2>

        {docs.map(d => (
          <div key={d.id} style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 20,
            marginBottom: 20
          }}>
            <h3>{d.type}</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{d.inhoud}</pre>
          </div>
        ))}

      </div>
    </div>
  )
}
