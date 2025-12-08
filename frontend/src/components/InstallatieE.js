<?php /* FILE: frontend/src/components/InstallatieE.js — VOLLEDIG BESTAND */ ?>

export default function InstallatieE({ data }) {
  if (!data) return null

  return (
    <div>
      <p>Totaal vermogen: {data.totaal} W</p>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Ruimte</th>
            <th>Vermogen (W)</th>
            <th>Groep</th>
          </tr>
        </thead>

        <tbody>
          {data.groepen.map((g, i) => (
            <tr key={i}>
              <td>{g.ruimte}</td>
              <td>{g.vermogen}</td>
              <td>{g.groep}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
