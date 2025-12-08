<?php /* FILE: frontend/src/components/NotificationsPanel.js — VOLLEDIG BESTAND */ ?>

import { useEffect, useState } from "react"

export default function NotificationsPanel({ project_id }) {
  const [items, setItems] = useState([])

  async function load() {
    if (!project_id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/notifications?project_id=${project_id}`
    )
    const json = await res.json()
    setItems(json.notificaties || [])
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
      <h3>Laatste meldingen</h3>

      {items.length === 0 && <p>Geen meldingen.</p>}

      {items.slice(0, 5).map(n => (
        <div key={n.id} style={{ marginBottom: 15 }}>
          <b>{n.titel}</b>
          <div>{n.bericht}</div>
        </div>
      ))}

      <a
        href={`/projects/${project_id}/notifications`}
        style={{ display: "block", marginTop: 10 }}
      >
        Alle meldingen bekijken
      </a>
    </div>
  )
}
