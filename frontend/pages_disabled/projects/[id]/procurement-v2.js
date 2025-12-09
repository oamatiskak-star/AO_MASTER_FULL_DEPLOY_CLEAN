<?php /* FILE: frontend/pages/projects/[id]/procurement-v2.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function ProcurementV2() {
  const router = useRouter()
  const { id } = router.query

  const [aanvragen, setAanvragen] = useState([])
  const [facturen, setFacturen] = useState([])
  const [bonnen, setBonnen] = useState([])

  const [beschrijving, setBeschrijving] = useState("")
  const [leverancierId, setLeverancierId] = useState("")

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/procurement-v2?project_id=${id}`
    )
    const json = await res.json()

    setAanvragen(json.aanvragen || [])
    setFacturen(json.facturen || [])
    setBonnen(json.bonnen || [])
  }

  async function aanvraag() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/procurement-v2/offerte-aanvraag",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          leverancier_id: leverancierId,
          beschrijving
        })
      }
    )
    load()
  }

  useEffect(() => {
    load()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>
        <h1>Inkoop & Leveranciers — Level 2</h1>

        <h2>Offerte aanvragen</h2>
        <input
          placeholder="Leverancier ID"
          value={leverancierId}
          onChange={e => setLeverancierId(e.target.value)}
        />
        <textarea
          rows={4}
          placeholder="Beschrijving"
          value={beschrijving}
          onChange={e => setBeschrijving(e.target.value)}
        />
        <button
          style={styles.btn}
          onClick={aanvraag}
        >
          Aanvragen
        </button>

        <h2 style={{ marginTop: 40 }}>Aanvragen</h2>

        {aanvragen.map(a => (
          <div key={a.id} style={styles.card}>
            <p>{a.beschrijving}</p>
            <pre>{a.mail_tekst}</pre>
          </div>
        ))}

        <h2>Factuurcontroles</h2>
        {facturen.map(f => (
          <div key={f.id} style={styles.card}>
            <a href={f.result_url} target="_blank">Bekijk controle</a>
          </div>
        ))}

        <h2>Leverbonnen</h2>
        {bonnen.map(b => (
          <div key={b.id} style={styles.card}>
            <p>{b.beschrijving}</p>
            <a href={b.url} target="_blank">Bekijk bon</a>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  btn: {
    background: "#FFD400",
    padding: 12,
    border: "none",
    fontWeight: "bold",
    marginTop: 10
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 6,
    border: "1px solid #ddd",
    marginBottom: 20
  }
}
