<?php /* FILE: frontend/src/components/ArchitectV2Panel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function ArchitectV2Panel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/architect-v2?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.ontwerpen || []).length)
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
      
      <h3>Architect v2</h3>
      <p>{count} ontwerpen</p>
      <a href={`/projects/${project_id}/architect-v2`}>Openen</a>
    </div>
  )
}
