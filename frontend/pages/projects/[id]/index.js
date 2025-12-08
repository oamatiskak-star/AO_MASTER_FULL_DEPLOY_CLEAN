<?php /* FILE: frontend/pages/projects/[id]/index.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import ViewerPanel from "../../../src/components/ViewerPanel"
import NotificationsPanel from "../../../src/components/NotificationsPanel"

export default function ProjectDashboard() {
  const router = useRouter()
  const { id } = router.query

  const [project, setProject] = useState(null)

  async function loadProject() {
    if (!id) return

    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/projects/${id}`
    )
    const json = await res.json()
    setProject(json.project || null)
  }

  useEffect(() => {
    loadProject()
  }, [id])

  if (!project) {
    return (
      <div style={{ padding: 40 }}>
        Project wordt geladen...
      </div>
    )
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Project dashboard</h1>

      <div style={{
        background: "#fff",
        padding: 20,
        borderRadius: 8,
        border: "1px solid #ddd",
        marginBottom: 40,
        maxWidth: 600
      }}>
        <h2>{project.projectnaam}</h2>
        <p>Adres: {project.adres}</p>
        <p>Projectnummer: {project.projectnummer}</p>

        <div style={{ marginTop: 20 }}>
          <a
            href={`/projects/${id}/planning`}
            style={styles.link}
          >
            Planning
          </a>

          <a
            href={`/projects/${id}/calculations`}
            style={styles.link}
          >
            Calculaties
          </a>

          <a
            href={`/projects/${id}/notifications`}
            style={styles.link}
          >
            Meldingen
          </a>

          <a
            href={`/projects/${id}/viewer`}
            style={styles.link}
          >
            Documenten
          </a>

          <a
            href={`/projects/${id}/uploads`}
            style={styles.link}
          >
            Uploads
          </a>
        </div>
      </div>

      <div style={{ display: "flex", gap: 30 }}>
        
        <div style={{ width: 350 }}>
          <NotificationsPanel project_id={id} />
        </div>

        <div style={{ width: 350 }}>
          <ViewerPanel project_id={id} />
        </div>

      </div>
    </div>
  )
}

const styles = {
  link: {
    display: "inline-block",
    marginRight: 15,
    background: "#FFD400",
    padding: "10px 14px",
    borderRadius: 4,
    textDecoration: "none",
    color: "#000",
    fontWeight: "bold"
  }
}
