<?php /* FILE: frontend/src/components/InstallatieW.js — VOLLEDIG BESTAND */ ?>

export default function InstallatieW({ data }) {
  if (!data) return null

  return (
    <div>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Ruimte</th>
            <th>Koud</th>
            <th>Warm</th>
            <th>Afvoer</th>
          </tr>
        </thead>

        <tbody>
          {data.aansluitpunten.map((a, i) => (
            <tr key={i}>
              <td>{a.ruimte}</td>
              <td>{a.koud}</td>
              <td>{a.warm}</td>
              <td>{a.afvoer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
