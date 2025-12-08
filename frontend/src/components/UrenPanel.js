<?php /* FILE: frontend/src/components/UrenPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function UrenPanel({ project_id }) {
  const [totaal, setTotaal] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/uren/totaal?project_id=${project_id}`
    )
    const json = await res.json()
    setTotaal(json.totaal || 0)
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
      
      <h3>Uren</h3>
      <p>Totaal geregistreerd: {totaal} uur</p>
      <a href={`/projects/${project_id}/uren`}>Openen</a>
    </div>
  )
}
