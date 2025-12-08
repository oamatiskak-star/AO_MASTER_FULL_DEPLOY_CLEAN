<?php /* FILE: frontend/pages/projects/[id]/offerte.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function OffertePage() {
  const router = useRouter()
  const { id } = router.query

  const [opdrachtgever, setOpdrachtgever] = useState("")
  const [adres, setAdres] = useState("")
  const [beschrijving, setBeschrijving] = useState("")
  const [calculatie, setCalculatie] = useState(null)
  const [offertes, setOffertes] = useState([])

  async function loadCalc() {
    if (!id) return
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/calc-engine?project_id=${id}`
    )
    const json = await res.json()

    if (json.auto_calc.length > 0) {
      setCalculatie(json.auto_calc[0].result)
    }
  }

  async function loadOffertes() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/offerte?project_id=${id}`
    )
    const json = await res.json()
    setOffertes(json.offertes)
  }

  async function generate() {
    if (!calculatie) return

    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/offerte/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          opdrachtgever,
          adres,
          beschrijving,
          calculatie
        })
      }
    )

    setOpdrachtgever("")
    setAdres("")
    setBeschrijving("")

    loadOffertes()
  }

  useEffect(() => {
    loadCalc()
    loadOffertes()
  }, [id])

  return (
    <div style={{ display: "flex" }}>
      <ProjectSidebar />

      <div style={{ padding: 40, flex: 1 }}>

        <h1>Offerte Generator</h1>

        {!calculatie && <p>Geen calculatie gevonden</p>}

        <input
          placeholder="Opdrachtgever"
          value={opdrachtgever}
          onChange={(e) => setOpdrachtgever(e.target.value)}
        />

        <input
          placeholder="Adres"
          value={adres}
          onChange={(e) => setAdres(e.target.value)}
        />

        <textarea
          placeholder="Projectomschrijving"
          value={beschrijving}
          onChange={(e) => setBeschrijving(e.target.value)}
          style={{ width: 300, height: 100 }}
        />

        <button
          onClick={generate}
          style={{
            background: "#FFD400",
            padding: 12,
            border: "none",
            fontWeight: "bold",
            marginTop: 10
          }}
        >
          Offerte genereren
        </button>

        <h2 style={{ marginTop: 40 }}>Offertes</h2>

        {offertes.map(o => (
          <div key={o.id} style={styles.card}>
            <p><b>{o.beschrijving}</b></p>
            <p>Totaal: € {o.totaal}</p>
            <a href={o.url} target="_blank">Download PDF</a>
          </div>
        ))}

      </div>
    </div>
  )
}

const styles = {
  card: {
    marginBottom: 20,
    background: "#fff",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 6
  }
}
