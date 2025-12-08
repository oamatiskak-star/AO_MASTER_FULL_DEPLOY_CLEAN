<?php /* FILE: frontend/pages/projects/[id]/architect.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"
import BlueprintSVG from "../../../src/components/BlueprintSVG"

export default function ArchitectPage() {
  const router = useRouter()
  const { id } = router.query

  const [wensen, setWensen] = useState("")
  const [blueprints, setBlueprints] = useState([])

  async function load() {
    if (!id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/architect?project_id=${id}`
    )
    const json = await res.json()
    setBlueprints(json.blueprints || [])
  }

  useEffect(() => {
    load()
  }, [id])

  async function generate() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/architect/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id, wensen })
      }
    )
    setWensen("")
    load()
  }

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />
      
      <div style={{ padding: 40, flex: 1 }}>
        
        <h1>AI Architect — Plattegronden</h1>

        <textarea
          placeholder="Wensen en eisen (bijv. aantal kamers, oppervlaktes)"
          value={wensen}
          onChange={(e) => setWensen(e.target.value)}
          style={{ width: 400, height: 100 }}
        />

        <br />

        <button
          onClick={generate}
          style={{
            background: "#FFD400",
            padding: 12,
            fontWeight: "bold",
            border: "none",
            marginTop: 10
          }}
        >
          Genereer plattegrond
        </button>

        <h2 style={{ marginTop: 40 }}>Blueprints</h2>

        <div style={{ display: "grid", gap: 40 }}>
          {blueprints.map(bp => (
            <div key={bp.id}>
              <BlueprintSVG data={bp.blueprint_json} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
