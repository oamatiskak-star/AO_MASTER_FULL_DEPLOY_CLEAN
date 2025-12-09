<?php /* FILE: frontend/pages/projects/[id]/uren.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function UrenPage() {
  const router = useRouter()
  const { id } = router.query

  const [urenlijst, setUrenlijst] = useState([])
  const [werknemer, setWerknemer] = useState("")
  const [taak, setTaak] = useState("")
  const [datum, setDatum] = useState("")
  const [uren, setUren] = useState("")

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/uren?project_id=${id}`
    )
    const json = await res.json()
    setUrenlijst(json.uren || [])
  }

  async function save() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/uren/add",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          werknemer,
          taak,
          datum,
          uren: Number(uren)
        })
      }
    )

    setWerknemer("")
    setTaak("")
    setDatum("")
    setUren("")
    load()
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>

        <h1>Urenregistratie</h1>

        <div style={styles.form}>
          <input placeholder="Werknemer" value={werknemer} onChange={e => setWerknemer(e.target.value)} />
          <input placeholder="Taak" value={taak} onChange={e => setTaak(e.target.value)} />
          <input type="date" value={datum} onChange={e => setDatum(e.target.value)} />
          <input placeholder="Uren" value={uren} onChange={e => setUren(e.target.value)} />

          <button
            onClick={save}
            style={{
              background: "#FFD400",
              padding: 12,
              border: "none",
              fontWeight: "bold",
              marginTop: 10
            }}
          >
            Opslaan
          </button>
        </div>

        <h2 style={{ marginTop: 40 }}>Geregistreerde uren</h2>

        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Werknemer</th>
              <th>Taak</th>
              <th>Datum</th>
              <th>Uren</th>
            </tr>
          </thead>

          <tbody>
            {urenlijst.map(u => (
              <tr key={u.id}>
                <td>{u.werknemer}</td>
                <td>{u.taak}</td>
                <td>{u.datum}</td>
                <td>{u.uren}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

const styles = {
  form: {
    display: "grid",
    gap: 10,
    width: 300
  }
}
