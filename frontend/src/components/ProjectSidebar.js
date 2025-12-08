<?php /* FILE: frontend/src/components/ProjectSidebar.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"

export default function ProjectSidebar() {
  const router = useRouter()
  const { id } = router.query

  const link = (title, path) => (
    <a
      href={`/projects/${id}/${path}`}
      style={{
        display: "block",
        padding: 12,
        borderBottom: "1px solid #eee",
        textDecoration: "none",
        color: "#000"
      }}
    >
      {title}
    </a>
  )

  return (
    <div style={{
      width: 220,
      borderRight: "1px solid #ddd",
      padding: "20px 0"
    }}>
      {link("Dashboard", "")}
      {link("Planning", "planning")}
      {link("Calculaties", "calculations")}
      {link("Meldingen", "notifications")}
      {link("Documenten", "viewer")}
      {link("Uploads", "uploads")}
    </div>
  )
}
