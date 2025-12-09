<?php /* FILE: frontend/pages/projects/[id]/planning.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function PlanningPage() {
  const router = useRouter()
  const { id } = router.query

  const [fases, setFases] = useState([])
  const [taken, setTaken] = useState([])

  const [faseNaam, setFaseNaam] = useState("")
  const [taak, setTaak] = useState({
    fase_id: "",
    taaknaam: "",
    startdatum: "",
    einddatum: "",
    voortgang: 0
  })

  async function load() {
    if (!id) return

    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/planning?project_id=${id}`
    )
    const json = await res.json()

    setFases(json.fases || [])
    setTaken(json.taken || [])
  }

  useEffect(() => {
    load()
  }, [id])

  async function addFase(e) {
    e.preventDefault()

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/planning/fase",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          naam: faseNaam,
          volgorde: fases.length + 1
        })
      }
    )

    setFaseNaam("")
    load()
  }

  async function addTaak(e) {
    e.preventDefault()

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/planning/taak",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...taak, project_id: id })
      }
    )

    setTaak({
      fase_id: "",
      taaknaam: "",
      startdatum: "",
      einddatum: "",
      voortgang: 0
    })

    load()
  }

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        <h1>Planning 2.0</h1>

        {/* Fase toevoegen */}
        <form onSubmit={addFase} style={{ marginBottom: 40 }}>
          <h3>Nieuwe fase</h3>

          <input
            value={faseNaam}
            onChange={(e) => setFaseNaam(e.target.value)}
            placeholder="Fasenaam"
          />

          <button style={styles.button}>
            Toevoegen
          </button>
        </form>

        {/* Taak toevoegen */}
        <form onSubmit={addTaak} style={{ marginBottom: 40 }}>
          <h3>Nieuwe taak</h3>

          <select
            value={taak.fase_id}
            onChange={(e) => setTaak({ ...taak, fase_id: e.target.value })}
          >
            <option value="">Kies fase</option>
            {fases.map(f => (
              <option key={f.id} value={f.id}>{f.naam}</option>
            ))}
          </select>

          <input
            placeholder="Taaknaam"
            value={taak.taaknaam}
            onChange={(e) => setTaak({ ...taak, taaknaam: e.target.value })}
          />

          <input
            type="date"
            value={taak.startdatum}
            onChange={(e) => setTaak({ ...taak, startdatum: e.target.value })}
          />

          <input
            type="date"
            value={taak.einddatum}
            onChange={(e) => setTaak({ ...taak, einddatum: e.target.value })}
          />

          <input
            placeholder="Voortgang %"
            value={taak.voortgang}
            onChange={(e) => setTaak({ ...taak, voortgang: e.target.value })}
          />

          <button style={styles.button}>
            Toevoegen
          </button>
        </form>

        <h2>Planning overzicht</h2>

        {fases.map(f => (
          <div key={f.id} style={styles.faseBox}>
            <h3>{f.naam}</h3>

            {taken.filter(t => t.fase_id === f.id).map(t => (
              <div key={t.id} style={styles.task}>
                <p><b>{t.taaknaam}</b></p>
                <p>{t.startdatum} → {t.einddatum}</p>
                <p>Voortgang: {t.voortgang}%</p>
              </div>
            ))}

          </div>
        ))}

      </div>
    </div>
  )
}

const styles = {
  button: {
    background: "#FFD400",
    padding: 10,
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    marginLeft: 10
  },
  faseBox: {
    background: "#fff",
    padding: 20,
    marginBottom: 30,
    borderRadius: 6,
    border: "1px solid #ddd"
  },
  task: {
    background: "#fafafa",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    border: "1px solid #eee"
  }
}
