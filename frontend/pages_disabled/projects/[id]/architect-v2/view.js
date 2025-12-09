<?php /* FILE: frontend/pages/projects/[id]/architect-v2/view.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function ViewArchitectV2() {
  const router = useRouter()
  const { url } = router.query

  const [json, setJson] = useState(null)

  useEffect(() => {
    if (!url) return
    fetch(`/api/architect-v2/variant?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(setJson)
  }, [url])

  if (!json) return <div style={{ padding: 40 }}>Laden...</div>

  return (
    <div style={{ padding: 40 }}>
      <h1>Ontwerpvariant</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(json, null, 2)}
      </pre>
    </div>
  )
}
