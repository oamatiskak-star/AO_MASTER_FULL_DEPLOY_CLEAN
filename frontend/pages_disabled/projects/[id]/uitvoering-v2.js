<?php /* FILE: frontend/pages/projects/[id]/uitvoering-v2.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function UitvoeringV2() {
  const router = useRouter()
  const { id } = router.query

  const [dagrapport, setDagrapport] = useState("{}")
  const [werkbon, setWerkbon] = useState("{}")
  const [vgm, setVgm] = useState("{}")
  const [fotoUrl, setFotoUrl] = useState("")
  const [beschrijving, setBeschrijving] = useState("")
  const [lijst, setLijst] = useState([])

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/uitvoering-v2?project_id=${id}`
    )
    const json = await res.json()
    setLijst(json.uitvoering || [])
  }

  async function opsturen(endpoint, body) {
    await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/uitvoering-v2/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
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
        
        <h1>Uitvoering Engine — Level 2</h1>

        <h2>Dagrapport</h2>
        <textarea
          rows={6}
          value={dagrapport}
          onChange={e => setDagrapport(e.target.value)}
        />
        <button
          style={styles.btn}
          onClick={() =>
            opsturen("dagrapport", {
              project_id: id,
              rapport: JSON.parse(dagrapport)
            })
          }
        >
          Dagrapport genereren
        </button>

        <h2>Werkbon</h2>
        <textarea
          rows={6}
          value={werkbon}
          onChange={e => setWerkbon(e.target.value)}
        />
        <button
          style={styles.btn}
          onClick={() =>
            opsturen("werkbon", {
              project_id: id,
              bon: JSON.parse(werkbon)
            })
          }
        >
          Werkbon opslaan
        </button>

        <h2>VGM / LMRA</h2>
        <textarea
          rows={6}
          value={vgm}
          onChange={e => setVgm(e.target.value)}
        />
        <button
          style={styles.btn}
          onClick={() =>
            opsturen("vgm", {
              project_id: id,
              vgm: JSON.parse(vgm)
            })
          }
        >
          VGM rapport opslaan
        </button>

        <h2>Foto upload</h2>
        <input
          placeholder="URL van foto"
          value={fotoUrl}
          onChange={e => setFotoUrl(e.target.value)}
        />
        <input
          placeholder="Beschrijving"
          value={beschrijving}
          onChange={e => setBeschrijving(e.target.value)}
        />
        <button
          style={styles.btn}
          onClick={() =>
            opsturen("fotolog", {
              project_id: id,
              url: fotoUrl,
              beschrijving
            })
          }
        >
          Foto toevoegen
        </button>

        <h2 style={{ marginTop: 40 }}>Logboek</h2>

        {lijst.map(item => (
          <div key={item.id} style={styles.card}>
            <p>Type: {item.type}</p>
            {item.pdf_url && <a href={item.pdf_url}>Download PDF</a>}
            {item.foto_url && <img src={item.foto_url} width="200" />}
            {item.beschrijving && <p>{item.beschrijving}</p>}
            {item.data && (
              <pre>{JSON.stringify(item.data, null, 2)}</pre>
            )}
          </div>
        ))}

      </div>
    </div>
  )
}

const styles = {
  btn: {
    background: "#FFD400",
    padding: 10,
    border: "none",
    marginTop: 10,
    marginBottom: 30,
    fontWeight: "bold"
  },
  card: {
    background: "#fff",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 6,
    marginBottom: 20
  }
}
