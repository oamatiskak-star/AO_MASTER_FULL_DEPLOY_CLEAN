<?php /* FILE: frontend/src/components/CalculatieV2Panel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function CalculatieV2Panel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calc-engine-v2?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.calculaties || []).length)
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
      
      <h3>AI Calculatie v2</h3>
      <p>{count} varianten</p>
      <a href={`/projects/${project_id}/calculatie-v2`}>Openen</a>
    </div>
  )
}
