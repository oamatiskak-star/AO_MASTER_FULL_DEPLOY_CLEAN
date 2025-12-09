<?php /* FILE: frontend/pages/projects/[id]/analytics-v2.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function AnalyticsV2() {
  const router = useRouter()
  const { id } = router.query

  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/analytics-v2?project_id=${id}`
    )
    const json = await res.json()
    setAnalyses(json.analyses || [])
  }

  async function generate() {
    setLoading(true)
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/analytics-v2/generate",
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
        
        <h1>AI Analytics Engine — Level 2</h1>

        <button
          onClick={generate}
          style={{
            background: "#FFD400",
            padding: 12,
            border: "none",
            fontWeight: "bold"
          }}
        >
          {loading ? "Analyse genereren..." : "Genereer analyse"}
        </button>

        <h2 style={{ marginTop: 40 }}>Analyses</h2>

        {analyses.map(a => (
          <div key={a.id} style={styles.card}>
            <p>Analyse ID: {a.id}</p>
            <a href={a.json_url} target="_blank">JSON bekijken</a>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20
  }
}
