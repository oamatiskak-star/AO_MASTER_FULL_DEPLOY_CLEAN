<?php /* FILE: frontend/pages/projects/[id]/notifications.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function NotificationsPage() {
  const router = useRouter()
  const { id } = router.query

  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    titel: "",
    bericht: "",
    type: ""
  })

  async function load() {
    if (!id) return

    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/notifications?project_id=${id}`
    )

    const json = await res.json()
    setItems(json.notificaties || [])
  }

  useEffect(() => {
    load()
  }, [id])

  function change(k, v) {
    setForm({ ...form, [k]: v })
  }

  async function submit(e) {
    e.preventDefault()

    const payload = {
      ...form,
      project_id: id
    }

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/notifications",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )

    setForm({ titel: "", bericht: "", type: "" })
    load()
  }

  async function remove(id) {
    await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/notifications/${id}`,
      {
        method: "DELETE"
      }
    )

    load()
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Notificaties</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 400 }}>
        <input
          placeholder="Titel"
          value={form.titel}
          onChange={e => change("titel", e.target.value)}
        />

        <textarea
          placeholder="Bericht"
          value={form.bericht}
          onChange={e => change("bericht", e.target.value)}
          rows={4}
        />

        <input
          placeholder="Type (info, waarschuwing, urgent, planning, factuur, etc)"
          value={form.type}
          onChange={e => change("type", e.target.value)}
        />

        <button type="submit">Opslaan</button>
      </form>

      <h2 style={{ marginTop: 40 }}>Overzicht</h2>

      {items.length === 0 && <p>Geen notificaties.</p>}

      {items.map(n => (
        <div key={n.id} style={{
          padding: 15,
          border: "1px solid #ddd",
          marginBottom: 20,
          borderRadius: 6
        }}>
          <h3>{n.titel}</h3>
          <div>{n.bericht}</div>
          <small>
            {n.type} — {n.created_at}
          </small>

          <button
            onClick={() => remove(n.id)}
            style={{
              background: "#FFD400",
              padding: 8,
              marginTop: 10,
              borderRadius: 4,
              cursor: "pointer",
              border: "none"
            }}
          >
            Verwijderen
          </button>
        </div>
      ))}
    </div>
  )
}
