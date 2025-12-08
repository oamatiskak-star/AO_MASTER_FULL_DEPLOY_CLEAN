<?php /* FILE: frontend/src/components/DocumentBuilderV3Panel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function DocumentBuilderV3Panel({ project_id }) {
  const [count, setCount] = useState(0)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/document-builder-v3?project_id=${project_id}`
    )
    const json = await res.json()
    setCount((json.documenten || []).length)
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
      <h3>Document Builder v3</h3>
      <p>{count} documenten</p>
      <a href={`/projects/${project_id}/document-builder-v3`}>Openen</a>
    </div>
  )
}
