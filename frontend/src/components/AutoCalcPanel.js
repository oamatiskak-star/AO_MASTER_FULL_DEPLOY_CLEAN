<?php /* FILE: frontend/src/components/AutoCalcPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function AutoCalcPanel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calc-engine?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.auto_calc || []).length)
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
      
      <h3>AI Calculatie Engine</h3>
      <p>Gegenereerd: {count}</p>

      <a href={`/projects/${project_id}/auto-calc`}>
        Openen
      </a>
    </div>
  )
}
