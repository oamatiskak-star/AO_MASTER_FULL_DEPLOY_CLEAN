<?php /* FILE: frontend/pages/projects/[id]/investment-level3.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function InvestmentLevel3() {
  const router = useRouter()
  const { id } = router.query

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/investment-level3?project_id=${id}`
    )
    const json = await res.json()
    setList(json.investment || [])
  }

  async function generate() {
    setLoading(true)
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/investment-level3/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id })
      }
    )
    setLoading(false)
    load()
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        <h1>Investment Level 3 — Exploitatie & Rendement</h1>

        <button onClick={generate} style={styles.btn}>
          {loading ? "Bezig..." : "Genereer Analyse"}
        </button>

        <h2 style={{ marginTop: 40 }}>Analyses</h2>

        {list.map(m => (
          <div key={m.id} style={styles.card}>
            <p>ID: {m.id}</p>
            <a href={m.json_url} target="_blank">JSON</a><br/>
            <a href={m.pdf_url} target="_blank">PDF</a>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  btn: {
    background: "#FFD400",
    padding: 12,
    border: "none",
    fontWeight: "bold"
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20
  }
}
