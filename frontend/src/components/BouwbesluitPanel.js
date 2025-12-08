<?php /* FILE: frontend/src/components/BouwbesluitPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function BouwbesluitPanel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/bouwbesluit?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.checks || []).length)
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
      
      <h3>Bouwbesluit</h3>
      <p>{count} controles uitgevoerd</p>

      <a href={`/projects/${project_id}/bouwbesluit`}>Openen</a>
    </div>
  )
}
