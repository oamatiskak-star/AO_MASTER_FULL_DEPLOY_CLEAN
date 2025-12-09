<?php /* FILE: frontend/pages/projects/[id]/architect-level3.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function ArchitectLevel3() {
  const router = useRouter()
  const { id } = router.query

  const [modellen, setModellen] = useState([])
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/architect-level3?project_id=${id}`
    )
    const json = await res.json()
    setModellen(json.modellen || [])
  }

  async function generate() {
    setLoading(true)
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/architect-level3/generate-models",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id })
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
        <h1>Architect Level 3 — DWG/BIM Export</h1>

        <button
          onClick={generate}
          style={styles.btn}
        >
          {loading ? "Bezig..." : "Genereer Model"}
        </button>

        <h2 style={{ marginTop: 40 }}>Gegenereerde Modellen</h2>

        {modellen.map(m => (
          <div key={m.id} style={styles.card}>
            <p>Model ID: {m.id}</p>
            <a href={m.json_url} target="_blank">JSON</a><br />
            <a href={m.dwg_url} target="_blank">DWG</a><br />
            <a href={m.ifc_url} target="_blank">IFC</a><br />
            <a href={m.pdf_url} target="_blank">PDF</a>
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
    fontWeight: "bold"
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20
  }
}
