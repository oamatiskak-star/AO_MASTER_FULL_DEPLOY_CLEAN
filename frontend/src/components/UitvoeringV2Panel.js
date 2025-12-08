<?php /* FILE: frontend/src/components/UitvoeringV2Panel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function UitvoeringV2Panel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/uitvoering-v2?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.uitvoering || []).length)
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
      <h3>Uitvoering v2</h3>
      <p>{count} items</p>
      <a href={`/projects/${project_id}/uitvoering-v2`}>Openen</a>
    </div>
  )
}
