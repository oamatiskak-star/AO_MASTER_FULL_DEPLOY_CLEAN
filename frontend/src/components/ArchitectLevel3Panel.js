<?php /* FILE: frontend/src/components/ArchitectLevel3Panel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function ArchitectLevel3Panel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/architect-level3?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.modellen || []).length)
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
      <h3>Architect Level 3</h3>
      <p>{count} modellen</p>
      <a href={`/projects/${project_id}/architect-level3`}>Openen</a>
    </div>
  )
}
