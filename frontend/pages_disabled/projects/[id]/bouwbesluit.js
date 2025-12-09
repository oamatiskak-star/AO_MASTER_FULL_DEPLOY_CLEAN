<?php /* FILE: frontend/pages/projects/[id]/bouwbesluit.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function BouwbesluitPage() {
  const router = useRouter()
  const { id } = router.query

  const [checks, setChecks] = useState([])

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/bouwbesluit?project_id=${id}`
    )
    const json = await res.json()
    setChecks(json.checks || [])
  }

  async function runCheck() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/bouwbesluit/check",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id })
      }
    )
    load()
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>

        <h1>Bouwbesluit Controle</h1>

        <button
          onClick={runCheck}
          style={{
            background: "#FFD400",
            padding: 12,
            border: "none",
            fontWeight: "bold"
          }}
        >
          Bouwbesluit controleren
        </button>

        <h2 style={{ marginTop: 40 }}>Resultaten</h2>

        {checks.map(c => (
          <div key={c.id} style={styles.card}>
            {c.resultaten.map((r, index) => (
              <div key={index}>
                <h3>{r.regel}</h3>
                <p>Status: {r.ok ? "Goedgekeurd" : "Afgekeurd"}</p>

                {!r.ok && (
                  <ul>
                    {r.fails.map((f, i) => (
                      <li key={i}>
                        {f.ruimte}: vereist {f.eis}, gemeten {f.waarde}
                      </li>
                    ))}
                  </ul>
                )}

                <hr />
              </div>
            ))}
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
