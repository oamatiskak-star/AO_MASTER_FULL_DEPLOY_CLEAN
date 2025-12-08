<?php /* FILE: frontend/src/components/InkoopPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function InkoopPanel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/inkoop?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.orders || []).length)
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
      
      <h3>Inkoop</h3>
      <p>{count} orders</p>
      <a href={`/projects/${project_id}/inkoop`}>Openen</a>
    </div>
  )
}
