<?php /* FILE: frontend/src/components/UitvoeringPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function UitvoeringPanel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/uitvoering/dagrapporten?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.rapporten || []).length)
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
      
      <h3>Uitvoering</h3>
      <p>{count} dagrapporten</p>
      <a href={`/projects/${project_id}/uitvoering`}>Openen</a>
    </div>
  )
}
