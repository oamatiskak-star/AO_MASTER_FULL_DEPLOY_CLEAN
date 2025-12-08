<?php /* FILE: frontend/src/components/CalculationsPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function CalculationsPanel({ project_id }) {
  const [items, setItems] = useState([])

  async function load() {
    if (!project_id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calc?project_id=${project_id}`
    )
    const json = await res.json()
    setItems(json.calculaties || [])
  }

  useEffect(() => {
    load()
  }, [project_id])

  const totaal = items.reduce((sum, x) => sum + Number(x.totaal || 0), 0)

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 6,
      border: "1px solid #ddd"
    }}>
      <h3>Samenvatting calculatie</h3>

      <p>Aantal posten: {items.length}</p>
      <p>Totaal: € {totaal.toFixed(2)}</p>

      <a href={`/projects/${project_id}/calculations`}>
        Calculaties openen
      </a>
    </div>
  )
}
