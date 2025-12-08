<?php /* FILE: frontend/pages/projects/[id]/uitvoering.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function UitvoeringPage() {
  const router = useRouter()
  const { id } = router.query

  const [rapporten, setRapporten] = useState([])
  const [fotos, setFotos] = useState([])

  const [datum, setDatum] = useState("")
  const [werkzaamheden, setWerkzaamheden] = useState("")
  const [meerwerk, setMeerwerk] = useState("")
  const [materialen, setMaterialen] = useState("")

  async function loadRapporten() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/uitvoering/dagrapporten?project_id=${id}`
    )
    const json = await res.json()
    setRapporten(json.rapporten || [])
  }

  async function loadFotos() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/uitvoering/fotos?project_id=${id}`
    )
    const json = await res.json()
    setFotos(json.fotos || [])
  }

  async function save() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/uitvoering/dagrapport",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          datum,
          werkzaamheden,
          meerwerk,
          materialen
        })
      }
    )

    setDatum("")
    setWerkzaamheden("")
    setMeerwerk("")
    setMaterialen("")

    loadRapporten()
  }

  useEffect(() => {
    loadRapporten()
    loadFotos()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        
        <h1>Uitvoering — Dagrapporten & Foto’s</h1>

        <div style={styles.form}>
          <input type="date" value={datum} onChange={e => setDatum(e.target.value)} />
          <textarea placeholder="Werkzaamheden" value={werkzaamheden} onChange={e => setWerkzaamheden(e.target.value)} />
          <textarea placeholder="Meerwerk" value={meerwerk} onChange={e => setMeerwerk(e.target.value)} />
          <textarea placeholder="Materialen" value={materialen} onChange={e => setMaterialen(e.target.value)} />

          <button
            onClick={save}
            style={{
              background: "#FFD400",
              padding: 12,
              border: "none",
              fontWeight: "bold"
            }}
          >
            Dagrapport opslaan
          </button>
        </div>

        <h2 style={{ marginTop: 40 }}>Dagrapporten</h2>

        {rapporten.map(r => (
          <div key={r.id} style={styles.card}>
            <b>{r.datum}</b>
            <p>Werkzaamheden: {r.werkzaamheden}</p>
            <p>Meerwerk: {r.meerwerk}</p>
            <p>Materialen: {r.materialen}</p>
          </div>
        ))}

        <h2 style={{ marginTop: 40 }}>Foto’s</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {fotos.map(f => (
            <img key={f.id} src={f.url} style={{ width: "100%", borderRadius: 6 }} />
          ))}
        </div>

      </div>
    </div>
  )
}

const styles = {
  form: {
    display: "grid",
    gap: 10,
    width: 400
  },
  card: {
    background: "#fff",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 6,
    marginBottom: 20
  }
}
