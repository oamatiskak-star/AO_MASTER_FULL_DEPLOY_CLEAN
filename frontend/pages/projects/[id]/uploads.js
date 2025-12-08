<?php /* FILE: frontend/pages/projects/[id]/upload.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function UploadPage() {
  const router = useRouter()
  const { id } = router.query

  const [file, setFile] = useState(null)
  const [categorie, setCategorie] = useState("tekening")

  async function upload(e) {
    e.preventDefault()

    const body = new FormData()
    body.append("project_id", id)
    body.append("categorie", categorie)
    body.append("file", file)

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/uploads",
      {
        method: "POST",
        body
      }
    )

    alert("Upload gelukt")
  }

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>

        <h1>Document uploaden</h1>

        <form
          onSubmit={upload}
          style={{ display: "grid", gap: 10, maxWidth: 400 }}
        >
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
          >
            <option value="tekening">Bouwtekening</option>
            <option value="installatie">Installatieschema</option>
            <option value="detail">Detailblad</option>
            <option value="overig">Overig</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            type="submit"
            style={{
              background: "#FFD400",
              padding: 12,
              fontWeight: "bold",
              border: "none",
              cursor: "pointer"
            }}
          >
            Uploaden
          </button>
        </form>

      </div>
    </div>
  )
}
