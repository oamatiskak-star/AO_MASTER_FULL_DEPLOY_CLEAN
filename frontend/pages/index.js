import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("API FOUT:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>SterkBouw Dashboard</h1>

      <section style={{ marginTop: "20px" }}>
        <h2>Projecten</h2>

        {loading && <p>Data laden...</p>}

        {!loading && projects.length === 0 && (
          <p>Geen projecten gevonden.</p>
        )}

        {!loading && projects.length > 0 && (
          <pre
            style={{
              background: "#f4f4f4",
              padding: "15px",
              borderRadius: "6px"
            }}
          >
            {JSON.stringify(projects, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}
