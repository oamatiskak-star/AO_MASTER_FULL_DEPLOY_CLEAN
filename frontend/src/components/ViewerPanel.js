<?php /* FILE: frontend/src/components/ViewerPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function ViewerPanel({ project_id }) {
  const [docs, setDocs] = useState([])

  async function load() {
    if (!project_id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/viewer?project_id=${project_id}`
    )
    const json = await res.json()
    setDocs(json.documenten || [])
  }

  useEffect(() => {
    load()
  }, [project_id])

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 6,
      border: "1px solid #ddd",
      maxHeight: 220,
      overflow: "auto"
    }}>
      
      <h3>Documenten</h3>

      {docs.slice(0, 5).map(x => (
        <div key={x.id} style={{ marginBottom: 10 }}>
          <b>{x.bestandsnaam}</b><br />
          <a href={`/projects/${project_id}/viewer`}>
            Bekijken
          </a>
        </div>
      ))}

      <a href={`/projects/${project_id}/viewer`}>
        Alle documenten
      </a>
    </div>
  )
}
