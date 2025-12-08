<?php /* FILE: frontend/src/components/PlanningPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function PlanningPanel({ project_id }) {
  const [taken, setTaken] = useState([])

  async function load() {
    if (!project_id) return

    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/planning?project_id=${project_id}`
    )
    const json = await res.json()

    setTaken(json.taken || [])
  }

  useEffect(() => {
    load()
  }, [project_id])

  const avg =
    taken.length === 0
      ? 0
      : taken.reduce((s, x) => s + Number(x.voortgang || 0), 0) /
        taken.length

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 6,
      border: "1px solid #ddd"
    }}>
      
      <h3>Planning</h3>

      <p>Totaal taken: {taken.length}</p>
      <p>Gemiddelde voortgang: {avg.toFixed(0)}%</p>

      <a href={`/projects/${project_id}/planning`}>
        Planning openen
      </a>
    </div>
  )
}
