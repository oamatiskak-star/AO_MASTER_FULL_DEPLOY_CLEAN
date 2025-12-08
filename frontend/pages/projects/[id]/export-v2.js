<?php /* FILE: frontend/pages/projects/[id]/export-v2.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function ExportV2() {
  const router = useRouter()
  const { id } = router.query

  const [loading, setLoading] = useState(false)
  const [zip, setZip] = useState(null)

  async function generate() {
    setLoading(true)
    const res = await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/export-v2/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id })
      }
    )

    const json = await res.json()
    setZip(json.zip_url)
    setLoading(false)
  }

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        <h1>Project Export — Level 2</h1>

        <button
          onClick={generate}
          style={{
            background: "#FFD400",
            padding: 14,
            border: "none",
            fontWeight: "bold",
            fontSize: 16
          }}
        >
          {loading ? "Bezig met export..." : "Genereer volledige export"}
        </button>

        {zip && (
          <div style={{ marginTop: 40 }}>
            <h3>Download klaar:</h3>
            <a href={zip} target="_blank">
              Download ZIP
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
