import { useEffect, useState } from "react";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => setOverview(data))
      .catch(err => console.error("API FOUT:", err));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Dashboard Overzicht</h1>

      {!overview && <p>Data laden...</p>}

      {overview && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "6px"
          }}
        >
          {JSON.stringify(overview, null, 2)}
        </pre>
      )}
    </div>
  );
}
