<?php /* FILE: frontend/src/components/ProcurementV2Panel.js — VOLLEDIG BESTAND */ ?>

import { useState, useEffect } from "react"

export default function ProcurementV2Panel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/procurement-v2?project_id=${project_id}`
    )
    const json = await res.json()

    const total =
      (json.aanvragen || []).length +
      (json.facturen || []).length +
      (json.bonnen || []).length

    setCount(total)
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
      <h3>Inkoop v2</h3>
      <p>{count} items</p>
      <a href={`/projects/${project_id}/procurement-v2`}>Openen</a>
    </div>
  )
}
