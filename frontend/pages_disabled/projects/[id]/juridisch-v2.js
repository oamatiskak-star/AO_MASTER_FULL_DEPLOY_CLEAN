<?php /* FILE: frontend/pages/projects/[id]/juridisch-v2.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

const types = [
  "Aannemingsovereenkomst",
  "Meerwerkovereenkomst",
  "Proces-verbaal oplevering",
  "Waarschuwingsbrief",
  "Ingebrekestelling",
  "Opschortingsverklaring",
  "Dwangsombrief",
  "Factuurgeschil",
  "Juridisch rapport",
  "Voortgangsverslag (juridisch)"
]

export default function JuridischV2() {
  const router = useRouter()
  const { id } = router.query

  const [parameters, setParameters] = useState("{}")
  const [selectedType, setSelectedType] = useState(types[0])
  const [documenten, setDocumenten] = useState([])

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/juridisch-v2?project_id=${id}`
    )
    const json = await res.json()
    setDocumenten(json.documenten || [])
  }

  async function generate() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/juridisch-v2/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          type: selectedType,
          parameters: JSON.parse(parameters)
        })
      }
    )

    setParameters("{}")
    load()
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        
        <h1>Juridische Documenten — Level 2</h1>

        <div style={{ display: "grid", gap: 12, width: 500 }}>
          
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            style={{ padding: 10 }}
          >
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <textarea
            rows={8}
            placeholder="Parameters in JSON"
            value={parameters}
            onChange={e => setParameters(e.target.value)}
          />

          <button
            onClick={generate}
            style={{
              background: "#FFD400",
              padding: 12,
              border: "none",
              fontWeight: "bold"
            }}
          >
            Document genereren
          </button>
        </div>

        <h2 style={{ marginTop: 40 }}>Documenten</h2>

        {documenten.map(doc => (
          <div key={doc.id} style={styles.card}>
            <p>{doc.type}</p>
            <a href={doc.pdf_url} target="_blank">Download PDF</a>
          </div>
        ))}

      </div>
    </div>
  )
}

const styles = {
  card: {
    background: "#fff",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 6,
    marginBottom: 20
  }
}
