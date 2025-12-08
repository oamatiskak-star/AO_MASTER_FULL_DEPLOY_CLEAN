<?php /* FILE: frontend/pages/projects/[id]/calculatie-v2.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function CalculatieV2() {
  const router = useRouter()
  const { id } = router.query

  const [parameters, setParameters] = useState("{}")
  const [calculaties, setCalculaties] = useState([])

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calc-engine-v2?project_id=${id}`
    )
    const json = await res.json()
    setCalculaties(json.calculaties || [])
  }

  async function generate() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/calc-engine-v2/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          parameters: JSON.parse(parameters)
        })
      }
    )

    setParameters("{}")
    load()
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        
        <h1>AI Calculatie Engine — V2</h1>

        <div style={styles.form}>
          <textarea
            placeholder="Parameters in JSON"
            rows={8}
            value={parameters}
            onChange={e => setParameters(e.target.value)}
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
            Calculatie genereren
          </button>
        </div>

        <h2 style={{ marginTop: 40 }}>Berekeningen</h2>

        {calculaties.map(c => (
          <div key={c.id} style={styles.card}>
            <p>Variant: {c.id}</p>
            <a href={`/projects/${id}/calculatie-v2/view?url=${encodeURIComponent(c.json_url)}`}>
              Bekijken
            </a>
          </div>
        ))}

      </div>
    </div>
  )
}

const styles = {
  form: {
    display: "grid",
    gap: 10,
    width: 400
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 6,
    border: "1px solid #ddd",
    marginBottom: 20
  }
}
