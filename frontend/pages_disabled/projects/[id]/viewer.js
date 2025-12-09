<?php /* FILE: frontend/pages/projects/[id]/viewer.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function ViewerPage() {
  const router = useRouter()
  const { id } = router.query

  const [docs, setDocs] = useState([])

  async function load() {
    if (!id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/viewer?project_id=${id}`
    )
    const json = await res.json()
    setDocs(json.documenten || [])
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>

        <h1>Documenten & Tekeningen</h1>

        <div style={styles.grid}>
          {docs.map(doc => (
            <div key={doc.id} style={styles.card}>
              <p><b>{doc.bestandsnaam}</b></p>
              <p>Categorie: {doc.categorie}</p>

              <a href={doc.url} target="_blank">
                Bekijken
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 6,
    border: "1px solid #ddd"
  }
}
