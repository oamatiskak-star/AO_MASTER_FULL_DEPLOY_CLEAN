<?php /* FILE: frontend/pages/projects/[id]/document-builder-v3.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function DocumentBuilderV3() {
  const router = useRouter()
  const { id } = router.query

  const [type, setType] = useState("Bouwrapport")
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)

  const types = [
    "Bouwrapport",
    "Investeringsmemorandum",
    "QuickScan Transformatie",
    "Exploitatieoverzicht",
    "Officiële Projectpresentatie",
    "Architectuurdocument",
    "Installatietechniek Analyse",
    "Calculatieoverzicht"
  ]

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/document-builder-v3?project_id=${id}`
    )
    const json = await res.json()
    setDocs(json.documenten || [])
  }

  async function generate() {
    setLoading(true)
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/document-builder-v3/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id, type })
      }
    )
    setLoading(false)
    load()
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        <h1>AI Document Builder — Level 3</h1>

        <h2>Nieuw document</h2>

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        >
          {types.map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <button
          style={styles.btn}
          onClick={generate}
        >
          {loading ? "Bezig..." : "Document genereren"}
        </button>

        <h2 style={{ marginTop: 40 }}>Documenten</h2>

        {docs.map(d => (
          <div key={d.id} style={styles.card}>
            <p>Type: {d.type}</p>
            <a href={d.json_url} target="_blank">JSON</a>
            <br />
            <a href={d.pdf_url} target="_blank">PDF</a>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  btn: {
    background: "#FFD400",
    padding: 12,
    border: "none",
    fontWeight: "bold",
    marginLeft: 10
  },
  card: {
    background: "#fff",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 6,
    marginBottom: 20
  }
}
