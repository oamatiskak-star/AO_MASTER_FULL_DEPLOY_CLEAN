<?php /* FILE: frontend/pages/projects/[id]/inkoop.js — VOLLEDIG BESTAND */ ?>

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import ProjectSidebar from "../../../src/components/ProjectSidebar"

export default function InkoopPage() {
  const router = useRouter()
  const { id } = router.query

  const [orders, setOrders] = useState([])

  const [leverancier, setLeverancier] = useState("")
  const [omschrijving, setOmschrijving] = useState("")
  const [hoeveelheid, setHoeveelheid] = useState("")
  const [prijs, setPrijs] = useState("")

  async function load() {
    const res = await fetch(
      `https://ao-master-full-deploy-clean.onrender.com/api/inkoop?project_id=${id}`
    )
    const json = await res.json()
    setOrders(json.orders || [])
  }

  async function save() {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/inkoop/add",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: id,
          leverancier,
          omschrijving,
          hoeveelheid: Number(hoeveelheid),
          prijs: Number(prijs)
        })
      }
    )

    setLeverancier("")
    setOmschrijving("")
    setHoeveelheid("")
    setPrijs("")

    load()
  }

  async function updateStatus(orderId, status) {
    await fetch(
      "https://ao-master-full-deploy-clean.onrender.com/api/inkoop/status",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status })
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
        
        <h1>Inkoopmodule</h1>

        <div style={{ display: "grid", gap: 10, width: 400 }}>
          <input placeholder="Leverancier" value={leverancier} onChange={e => setLeverancier(e.target.value)} />
          <input placeholder="Omschrijving" value={omschrijving} onChange={e => setOmschrijving(e.target.value)} />
          <input placeholder="Hoeveelheid" value={hoeveelheid} onChange={e => setHoeveelheid(e.target.value)} />
          <input placeholder="Prijs" value={prijs} onChange={e => setPrijs(e.target.value)} />

          <button
            onClick={save}
            style={{
              background: "#FFD400",
              padding: 12,
              border: "none",
              fontWeight: "bold"
            }}
          >
            Inkooporder opslaan
          </button>
        </div>

        <h2 style={{ marginTop: 40 }}>Inkooporders</h2>

        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Leverancier</th>
              <th>Omschrijving</th>
              <th>Hoeveelheid</th>
              <th>Prijs</th>
              <th>Status</th>
              <th>Actie</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.leverancier}</td>
                <td>{o.omschrijving}</td>
                <td>{o.hoeveelheid}</td>
                <td>{o.prijs}</td>
                <td>{o.status}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}
                  >
                    <option>Aangevraagd</option>
                    <option>Besteld</option>
                    <option>Geleverd</option>
                    <option>Geannuleerd</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}
