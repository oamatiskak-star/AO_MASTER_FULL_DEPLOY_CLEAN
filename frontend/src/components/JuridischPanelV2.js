<?php /* FILE: frontend/src/components/JuridischPanelV2.js — VOLLEDIG BESTAND */ ?>

import { useState, useEffect } from "react"

export default function JuridischPanelV2({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/juridisch-v2?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.documenten || []).length)
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
      <h3>Juridisch v2</h3>
      <p>{count} documenten</p>
      <a href={`/projects/${project_id}/juridisch-v2`}>Openen</a>
    </div>
  )
}
