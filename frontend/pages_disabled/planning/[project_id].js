<?php /* FILE: frontend/pages/planning/[project_id].js */ ?>

import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function PlanningPage() {
  const router = useRouter()
  const { project_id } = router.query

  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    taak: "",
    startdatum: "",
    einddatum: "",
    voortgang: ""
  })

  async function load() {
    if (!project_id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/planning/${project_id}`
    )
    const json = await res.json()
    setItems(json.planning || [])
  }

  useEffect(() => {
    load()
  }, [project_id])

  async function createItem() {
    const payload = {
      ...form,
      project_id
    }

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/planning",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )

    setForm({
      taak: "",
      startdatum: "",
      einddatum: "",
      voortgang: ""
    })

    load()
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Planning voor project {project_id}</h1>

      <h2>Nieuw item</h2>
      <input
        placeholder="Taak"
        value={form.taak}
        onChange={(e) => setForm({ ...form, taak: e.target.value })}
      />
      <input
        placeholder="Startdatum"
        type="date"
        value={form.startdatum}
        onChange={(e) => setForm({ ...form, startdatum: e.target.value })}
      />
      <input
        placeholder="Einddatum"
        type="date"
        value={form.einddatum}
        onChange={(e) => setForm({ ...form, einddatum: e.target.value })}
      />
      <input
        placeholder="Voortgang (%)"
        value={form.voortgang}
        onChange={(e) => setForm({ ...form, voortgang: e.target.value })}
      />

      <button onClick={createItem}>Opslaan</button>

      <h2>Planning items</h2>
      {items.length === 0 && <p>Geen planning gevonden.</p>}

      {items.map((p) => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <b>{p.taak}</b>
          <div>{p.startdatum} — {p.einddatum}</div>
          <div>Voortgang: {p.voortgang}%</div>
        </div>
      ))}
    </div>
  )
}
