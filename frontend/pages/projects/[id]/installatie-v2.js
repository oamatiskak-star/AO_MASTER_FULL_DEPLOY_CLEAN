<?php /* FILE: frontend/pages/projects/[id]/installatie-v2.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function InstallatieV2() {
  const router = useRouter()
  const { id } = router.query

  const [parameters, setParameters] = useState("{}")
  const [varianten, setVarianten] = useState([])

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/installatie-v2?project_id=${id}`
    )
    const json = await res.json()
    setVarianten(json.installaties || [])
  }

  async function generate() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/installatie-v2/generate",
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
        
        <h1>Installatietechniek Engine — V2</h1>

        <div style={{ display: "grid", gap: 10, width: 400 }}>
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
            Berekening genereren
          </button>
        </div>

        <h2 style={{ marginTop: 40 }}>Installatievarianten</h2>

        {varianten.map(v => (
          <div key={v.id} style={styles.card}>
            <p>Variant: {v.id}</p>
            <a href={`/projects/${id}/installatie-v2/view?url=${encodeURIComponent(v.json_url)}`}>
              Bekijken
            </a>
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
    borderRadius: 6,
    padding: 20,
    marginBottom: 20
  }
}
