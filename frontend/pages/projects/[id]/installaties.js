<?php /* FILE: frontend/pages/projects/[id]/installaties.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"
import InstallatieE from "../../../src/components/InstallatieE"
import InstallatieW from "../../../src/components/InstallatieW"

export default function InstallatiesPage() {
  const router = useRouter()
  const { id } = router.query

  const [installaties, setInstallaties] = useState([])

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/installatie?project_id=${id}`
    )
    const json = await res.json()
    setInstallaties(json.installaties || [])
  }

  async function generate() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/installatie/generate",
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
        
        <h1>Installatietechniek E + W</h1>

        <button
          onClick={generate}
          style={{
            background: "#FFD400",
            padding: 12,
            fontWeight: "bold",
            border: "none"
          }}
        >
          Nieuwe installatieberekening
        </button>

        <h2 style={{ marginTop: 40 }}>Resultaten</h2>

        {installaties.map(inst => (
          <div key={inst.id} style={styles.card}>
            <h3>Elektrisch</h3>
            <InstallatieE data={inst.result.elektra} />

            <h3 style={{ marginTop: 30 }}>Water & Afvoer</h3>
            <InstallatieW data={inst.result.water} />
          </div>
        ))}

      </div>
    </div>
  )
}

const styles = {
  card: {
    marginBottom: 25,
    padding: 20,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 6
  }
}
