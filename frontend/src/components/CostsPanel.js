<?php /* FILE: frontend/src/components/CostsPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function CostsPanel({ project_id }) {
  const [items, setItems] = useState([])

  async function load() {
    if (!project_id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/kosten?project_id=${project_id}`
    )
    const json = await res.json()
    setItems(json.kosten || [])
  }

  useEffect(() => {
    load()
  }, [project_id])

  const totaal = items.reduce((sum, x) => sum + Number(x.bedrag_totaal || 0), 0)

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 6,
      border: "1px solid #ddd"
    }}>
      
      <h3>Kosten</h3>

      <p>Aantal kostenregels: {items.length}</p>
      <p>Totaal: € {totaal.toFixed(2)}</p>

      <a href={`/projects/${project_id}/costs`}>
        Kostenoverzicht openen
      </a>
    </div>
  )
}
