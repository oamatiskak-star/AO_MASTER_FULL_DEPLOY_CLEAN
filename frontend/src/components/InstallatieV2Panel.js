<?php /* FILE: frontend/src/components/InstallatieV2Panel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function InstallatieV2Panel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/installatie-v2?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.installaties || []).length)
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
      
      <h3>Installatie v2</h3>
      <p>{count} varianten</p>
      <a href={`/projects/${project_id}/installatie-v2`}>Openen</a>
    </div>
  )
}
