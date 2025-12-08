<?php /* FILE: frontend/src/components/ExportPanel.js — VOLLEDIG BESTAND */ ?>

export default function ExportPanel({ project_id }) {
  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 6,
      border: "1px solid #ddd"
    }}>
      <h3>Export</h3>
      <p>Volledig einddossier genereren</p>
      <a href={`/projects/${project_id}/export-v2`}>Openen</a>
    </div>
  )
}
