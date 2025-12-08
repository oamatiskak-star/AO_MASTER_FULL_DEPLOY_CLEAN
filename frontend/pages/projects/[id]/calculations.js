<?php /* FILE: frontend/pages/projects/[id]/calculations.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function CalculationsPage() {
  const router = useRouter()
  const { id } = router.query

  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    omschrijving: "",
    categorie: "",
    stabu_code: "",
    eenheid: "",
    hoeveelheid: "",
    arbeidsuren: "",
    materiaalkosten: "",
    arbeidskosten: "",
    opslag_percentage: ""
  })

  async function load() {
    if (!id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calc?project_id=${id}`
    )
    const json = await res.json()
    setItems(json.calculaties || [])
  }

  useEffect(() => {
    load()
  }, [id])

  function set(k, v) {
    setForm({ ...form, [k]: v })
  }

  async function create(e) {
    e.preventDefault()

    const payload = {
      ...form,
      project_id: id
    }

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/calc",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )

    setForm({
      omschrijving: "",
      categorie: "",
      stabu_code: "",
      eenheid: "",
      hoeveelheid: "",
      arbeidsuren: "",
      materiaalkosten: "",
      arbeidskosten: "",
      opslag_percentage: ""
    })

    load()
  }

  return (
    <div style={{ display: "flex" }}>
      
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>

        <h1>Calculaties</h1>

        <form
          onSubmit={create}
          style={{
            display: "grid",
            gap: 10,
            marginBottom: 40,
            maxWidth: 500
          }}
        >
          <input
            placeholder="Omschrijving"
            value={form.omschrijving}
            onChange={(e) => set("omschrijving", e.target.value)}
          />

          <input
            placeholder="Categorie"
            value={form.categorie}
            onChange={(e) => set("categorie", e.target.value)}
          />

          <input
            placeholder="STABU code"
            value={form.stabu_code}
            onChange={(e) => set("stabu_code", e.target.value)}
          />

          <input
            placeholder="Eenheid"
            value={form.eenheid}
            onChange={(e) => set("eenheid", e.target.value)}
          />

          <input
            placeholder="Hoeveelheid"
            value={form.hoeveelheid}
            onChange={(e) => set("hoeveelheid", e.target.value)}
          />

          <input
            placeholder="Arbeidsuren"
            value={form.arbeidsuren}
            onChange={(e) => set("arbeidsuren", e.target.value)}
          />

          <input
            placeholder="Materiaalkosten"
            value={form.materiaalkosten}
            onChange={(e) => set("materiaalkosten", e.target.value)}
          />

          <input
            placeholder="Arbeidskosten"
            value={form.arbeidskosten}
            onChange={(e) => set("arbeidskosten", e.target.value)}
          />

          <input
            placeholder="Opslag %"
            value={form.opslag_percentage}
            onChange={(e) => set("opslag_percentage", e.target.value)}
          />

          <button type="submit" style={styles.button}>
            Opslaan
          </button>
        </form>

        <h2>Overzicht</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Omschrijving</th>
              <th>STABU</th>
              <th>Hoeveelheid</th>
              <th>Materiaal</th>
              <th>Arbeid</th>
              <th>Opslag</th>
              <th>Totaal</th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.omschrijving}</td>
                <td>{item.stabu_code}</td>
                <td>{item.hoeveelheid}</td>
                <td>{item.materiaalkosten}</td>
                <td>{item.arbeidskosten}</td>
                <td>{item.opslag_percentage}%</td>
                <td>{item.totaal}</td>
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
