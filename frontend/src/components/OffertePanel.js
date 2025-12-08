<?php /* FILE: frontend/src/components/OffertePanel.js — VOLLEDIG BESTAND */ ?>

import { useState, useEffect } from "react"

export default function OffertePanel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/offerte?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.offertes || []).length)
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
      <h3>Offertes</h3>
      <p>{count} offertes</p>
      <a href={`/projects/${project_id}/offerte`}>Openen</a>
    </div>
  )
}
