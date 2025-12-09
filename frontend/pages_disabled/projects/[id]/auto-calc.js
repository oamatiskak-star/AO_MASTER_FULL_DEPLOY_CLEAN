<?php /* FILE: frontend/pages/projects/[id]/auto-calc.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function AutoCalcPage() {
  const router = useRouter()
  const { id } = router.query

  const [omschrijving, setOmschrijving] = useState("")
  const [m2, setM2] = useState("")
  const [eisen, setEisen] = useState("")
  const [results, setResults] = useState([])

  async function load() {
    if (!id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calc-engine?project_id=${id}`
    )
    const json = await res.json()
    setResults(json.auto_calc || [])
  }

  useEffect(() => {
    load()
  }, [id])

  async function generate() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/calc-engine/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id, omschrijving, m2, eisen })
      }
    )
    setOmschrijving("")
    setM2("")
    setEisen("")
    load()
  }

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        
        <h1>AI Calculatie Engine</h1>

        <input
          placeholder="Omschrijving"
          value={omschrijving}
          onChange={(e) => setOmschrijving(e.target.value)}
        />

        <input
          placeholder="Oppervlakte m2"
          value={m2}
          onChange={(e) => setM2(e.target.value)}
        />

        <textarea
          placeholder="Eisen"
          value={eisen}
          onChange={(e) => setEisen(e.target.value)}
          style={{ width: 300, height: 100 }}
        />

        <button
          onClick={generate}
          style={{
            background: "#FFD400",
            padding: 12,
            border: "none",
            fontWeight: "bold",
            marginTop: 10
          }}
        >
          Genereer calculatie
        </button>

        <h2 style={{ marginTop: 40 }}>Gegenereerde calculaties</h2>

        {results.map(r => (
          <div key={r.id} style={styles.card}>
            <p><b>{r.result.omschrijving}</b></p>
            <p>Totaal: € {r.result.totaal.totaal.toFixed(2)}</p>
            <a href={`/projects/${id}/calculations`}>
              Naar calculaties
            </a>
          </div>
        ))}

      </div>
    </div>
  )
}

const styles = {
  card: {
    marginBottom: 20,
    background: "#fff",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 6
  }
}
