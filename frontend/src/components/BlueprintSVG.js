<?php /* FILE: frontend/src/components/BlueprintSVG.js — VOLLEDIG BESTAND */ ?>

export default function BlueprintSVG({ data }) {
  if (!data) return null

  const ruimtes = data.ruimtes || []

  return (
    <svg
      width="800"
      height="600"
      style={{ border: "1px solid #000", background: "#f9f9f9" }}
    >
      {ruimtes.map((r, i) => (
        <g key={i}>
          <rect
            x={r.x}
            y={r.y}
            width={r.breedte}
            height={r.hoogte}
            fill="#fff"
            stroke="#000"
          />
          <text
            x={r.x + 10}
            y={r.y + 20}
            fontSize="16"
            fill="#000"
          >
            {r.naam}
          </text>
        </g>
      ))}
    </svg>
  )
}
