<?php /* FILE: frontend/pages/projects/[id]/costs.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function CostsPage() {
  const router = useRouter()
  const { id } = router.query

  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    leverancier: "",
    omschrijving: "",
    categorie: "",
    bedrag_excl: "",
    btw_percentage: "",
    datum: ""
  })
  const [file, setFile] = useState(null)

  async function load() {
    if (!id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/kosten?project_id=${id}`
    )
    const json = await res.json()
    setItems(json.kosten || [])
  }

  useEffect(() => {
    load()
  }, [id])

  function setField(k, v) {
    setForm({ ...form, [k]: v })
  }

  async function submit(e) {
    e.preventDefault()

    const body = new FormData()
    body.append("project_id", id)
    body.append("leverancier", form.leverancier)
    body.append("omschrijving", form.omschrijving)
    body.append("categorie", form.categorie)
    body.append("bedrag_excl", form.bedrag_excl)
    body.append("btw_percentage", form.btw_percentage)
    body.append("datum", form.datum)

    if (file) {
      body.append("file", file)
    }

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/kosten",
      {
        method: "POST",
        body
      }
    )

    setForm({
      leverancier: "",
      omschrijving: "",
      categorie: "",
      bedrag_excl: "",
      btw_percentage: "",
      datum: ""
    })
    setFile(null)

    load()
  }

  const totaal = items.reduce((sum, x) => sum + Number(x.bedrag_totaal || 0), 0)

  return (
    <div style={{ display: "flex" }}>
      
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>

        <h1>Kosten & Facturen</h1>

        <form
          onSubmit={submit}
          style={{ display: "grid", gap: 10, marginBottom: 40, maxWidth: 500 }}
        >
          
          <input
            placeholder="Leverancier"
            value={form.leverancier}
            onChange={(e) => setField("leverancier", e.target.value)}
          />

          <input
            placeholder="Omschrijving"
            value={form.omschrijving}
            onChange={(e) => setField("omschrijving", e.target.value)}
          />

          <input
            placeholder="Categorie"
            value={form.categorie}
            onChange={(e) => setField("categorie", e.target.value)}
          />

          <input
            placeholder="Bedrag excl"
            value={form.bedrag_excl}
            onChange={(e) => setField("bedrag_excl", e.target.value)}
          />

          <input
            placeholder="BTW %"
            value={form.btw_percentage}
            onChange={(e) => setField("btw_percentage", e.target.value)}
          />

          <input
            type="date"
            value={form.datum}
            onChange={(e) => setField("datum", e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" style={styles.button}>
            Toevoegen
          </button>
        </form>

        <h2>Overzicht</h2>

        <p><b>Totaal kosten:</b> € {totaal.toFixed(2)}</p>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Leverancier</th>
              <th>Omschrijving</th>
              <th>Excl</th>
              <th>BTW</th>
              <th>Totaal</th>
              <th>Factuur</th>
            </tr>
          </thead>

          <tbody>
            {items.map(x => (
              <tr key={x.id}>
                <td>{x.datum}</td>
                <td>{x.leverancier}</td>
                <td>{x.omschrijving}</td>
                <td>€ {x.bedrag_excl}</td>
                <td>{x.btw_percentage}%</td>
                <td><b>€ {x.bedrag_totaal}</b></td>

                <td>
                  {x.factuur_url ? (
                    <a href={x.factuur_url} target="_blank">
                      Openen
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
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
