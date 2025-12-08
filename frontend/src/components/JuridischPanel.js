<?php /* FILE: frontend/src/components/JuridischPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function JuridischPanel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/juridisch?project_id=${project_id}`
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
      
      <h3>Juridisch (Ali)</h3>
      <p>{count} documenten</p>
      <a href={`/projects/${project_id}/juridisch`}>Openen</a>
    </div>
  )
}
