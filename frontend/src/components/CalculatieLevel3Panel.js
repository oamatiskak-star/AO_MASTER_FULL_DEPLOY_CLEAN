<?php /* FILE: frontend/src/components/CalculatieLevel3Panel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function CalculatieLevel3Panel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calc-level3?project_id=${project_id}`
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
      border: "1px solid #ddd",
      borderRadius: 6
    }}>
      <h3>Calculatie Level 3</h3>
      <p>{count} calculaties</p>
      <a href={`/projects/${project_id}/calculatie-level3`}>Openen</a>
    </div>
  )
}
