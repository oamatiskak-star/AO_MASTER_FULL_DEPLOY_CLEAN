<?php /* FILE: frontend/pages/projects/[id]/income.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function IncomePage() {
  const router = useRouter()
  const { id } = router.query

  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    huurder: "",
    bedrag: "",
    datum: "",
    maand: "",
    jaar: "",
    status: "open"
  })

  async function load() {
    if (!id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/inkomsten?project_id=${id}`
    )
    const json = await res.json()
    setItems(json.inkomsten || [])
  }

  useEffect(() => {
    load()
  }, [id])

  function setField(k, v) {
    setForm({ ...form, [k]: v })
  }

  async function submit(e) {
    e.preventDefault()

    const payload = {
      ...form,
      project_id: id
    }

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/inkomsten",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )

    setForm({
      huurder: "",
      bedrag: "",
      datum: "",
      maand: "",
      jaar: "",
      status: "open"
    })

    load()
  }

  const totaal = items.reduce((sum, x) => sum + Number(x.bedrag || 0), 0)

  return (
    <div style={{ display: "flex" }}>
      
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>

        <h1>Huurinkomsten</h1>

        <form
          onSubmit={submit}
          style={{ display: "grid", gap: 10, marginBottom: 40, maxWidth: 500 }}
        >
          <input
            placeholder="Huurder"
            value={form.huurder}
            onChange={(e) => setField("huurder", e.target.value)}
          />

          <input
            placeholder="Bedrag"
            value={form.bedrag}
            onChange={(e) => setField("bedrag", e.target.value)}
          />

          <input
            type="date"
            value={form.datum}
            onChange={(e) => setField("datum", e.target.value)}
          />

          <input
            placeholder="Maand"
            value={form.maand}
            onChange={(e) => setField("maand", e.target.value)}
          />

          <input
            placeholder="Jaar"
            value={form.jaar}
            onChange={(e) => setField("jaar", e.target.value)}
          />

          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            <option value="open">Open</option>
            <option value="betaald">Betaald</option>
          </select>

          <button type="submit" style={styles.button}>
            Toevoegen
          </button>
        </form>

        <h2>Overzicht</h2>

        <p><b>Totaal inkomsten:</b> € {totaal.toFixed(2)}</p>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Huurder</th>
              <th>Bedrag</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {items.map(x => (
              <tr key={x.id}>
                <td>{x.datum}</td>
                <td>{x.huurder}</td>
                <td>€ {x.bedrag}</td>
                <td>{x.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

const styles = {
  button: {
    background: "#FFD400",
    padding: 12,
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    borderRadius: 4
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20
  }
}
