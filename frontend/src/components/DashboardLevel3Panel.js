<?php /* FILE: frontend/src/components/DashboardLevel3Panel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function DashboardLevel3Panel({ project_id }) {
  const [status, setStatus] = useState("laden...")

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/dashboard-level3?project_id=${project_id}`
    )
    const json = await res.json()
    setStatus(json.dashboard.voortgang + "%")
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
      <h3>Dashboard L3</h3>
      <p>Voortgang: {status}</p>
      <a href={`/projects/${project_id}/dashboard-level3`}>Openen</a>
    </div>
  )
}
