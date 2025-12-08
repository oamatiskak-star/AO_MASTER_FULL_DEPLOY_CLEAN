<?php /* FILE: frontend/pages/projects/[id]/dashboard-level3.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function DashboardLevel3() {
  const router = useRouter()
  const { id } = router.query

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/dashboard-level3?project_id=${id}`
    )
    const json = await res.json()
    setData(json.dashboard)
    setLoading(false)
  }

  useEffect(() => {
    if (id) load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        <h1>Dashboard Level 3 — Executive AI Control</h1>

        <button onClick={load} style={styles.btn}>
          {loading ? "Bezig..." : "Ververs Dashboard"}
        </button>

        {!data ? (
          <p>Geen data...</p>
        ) : (
          <div style={{ marginTop: 30 }}>
            <h2>Voortgang: {data.voortgang}%</h2>
            <h3>Doorlooptijd: {data.doorlooptijd}</h3>

            <h2>KPI’s</h2>
            <ul>
              {data.kpi.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>

            <h2>Risico’s</h2>
            <ul>
              {data.risico.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <h2>Aanbevelingen</h2>
            <ul>
              {data.aanbevelingen.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <h2>Problemen</h2>
            <ul>
              {data.problemen.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>

            <h2>Analyse</h2>
            <p>{data.analyse}</p>
          </div>
        )}
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
  }
}
