<?php /* FILE: frontend/src/components/ArchitectPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function ArchitectPanel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/architect?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.blueprints || []).length)
  }

  useEffect(() => {
    load()
  }, [project_id])

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 6,
      border: "1px solid #ddd"
    }}>
      <h3>AI Architect</h3>
      <p>Blueprints: {count}</p>
      <a href={`/projects/${project_id}/architect`}>
        Openen
      </a>
    </div>
  )
}
